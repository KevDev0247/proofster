import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { createFormula, deleteFormula, getFormulas, updateFormula } from './formulaApi';
import { IFormula } from '../../models/formula';
import { toast } from 'react-toastify';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function Formula() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFormulas());
  }, [dispatch]);

  const formulaList = useSelector(
    (state: RootState) => state.formula.list.values
  );
  const isLoadingTable = useSelector(
    (state: RootState) => state.formula.list.isLoading
  );
  const isSaving = useSelector(
    (state: RootState) => state.formula.save.isSaving
  );
  const isDeleting = useSelector(
    (state: RootState) => state.formula.save.isDeleting
  );

  const [formula, setFormula] = useState<IFormula>({
    formula_id: 0,
    name: "",
    formula_raw: "",
    formula_result: "",
    is_conclusion: false,
    workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
  });
  const [showValidation, setShowValidation] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormula((prevState) => ({
      ...prevState,
      [name]: name === "is_conclusion" ? checked : value,
    }));
  };

  const selectFormula = (d: IFormula) => {
    setShowValidation(false);
    setFormula({
      formula_id: d.formula_id,
      name: d.name,
      formula_raw: d.formula_raw,
      formula_result: d.formula_result,
      is_conclusion: d.is_conclusion,
      workspace_id: d.workspace_id,
    });
  };

  const removeFormula = (id: number) => {
    if (id) 
      dispatch(deleteFormula(id))
        .unwrap()
        .then((response) => {
          toast.success(response);
          dispatch(getFormulas());
        })
        .catch((error) => {
          toast.error(error);
        });
  };

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (formula.name === "") {
      setShowValidation(true);
      return;
    }

    const action = 
      formula.formula_id === 0 
        ? createFormula(formula) 
        : updateFormula(formula)
      
    dispatch(action)
      .unwrap()
      .then((response) => {
        toast.success(response);
        resetForm();
        dispatch(getFormulas());
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const resetForm = () => {
    setFormula({
      formula_id: 0,
      name: "",
      formula_raw: "",
      formula_result: "",
      is_conclusion: false,
      workspace_id: "216da6d9-aead-4970-9465-69bfb55d4956",
    });
    setShowValidation(false);
  };

  return (
    <>
      <div className="form-container">
        <h1 className="title">
          Arguments Panel &nbsp;
          <span className="tag is-dark">{formulaList?.length}</span>
        </h1>
        <div className="card">
          <div className="card-content">
            <div className="content">
              <div className="columns">
                <div className="column is-4">
                  <Checkbox
                    title="Conclusion"
                    name="is_conclusion"
                    value={formula.is_conclusion}
                    inputChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="columns">
                <div className="column is-4">
                  <Input
                    type="text"
                    title="Name"
                    name="name"
                    placeholder="Enter name here"
                    value={formula.name}
                    inputChange={handleInputChange}
                    showValidation={showValidation}
                    isRequired={true}
                  />
                </div>
                <div className="column is-4">
                  <Input 
                    type="text"
                    title="Formula"
                    name="formula_raw"
                    placeholder="Enter formula in reverse polish form"
                    value={formula.formula_raw}
                    inputChange={handleInputChange}
                    showValidation={showValidation}
                    isRequired={true}
                  />
                </div>
              </div>
              <Button 
                type="is-dark"
                loading={isSaving}
                title="Submit"
                onClick={submit}
                disabled={isSaving || isDeleting}
              />
              &nbsp;
              {formula.formula_id !== 0 && (
                <Button 
                  title="Cancel"
                  onClick={resetForm}
                  disabled={isSaving || isDeleting}
                />
              )}
              <hr />
              {isLoadingTable && (
                <div className="has-text-centered">Fetching...</div>
              )}
              <div className="table-container">
                <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Formula</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formulaList?.map((d: IFormula, index: number) => {
                      return (
                        <tr key={index}>
                          <td>{d.name}</td>
                          <td>{d.is_conclusion ? "Conclusion" : "Premise"}</td>
                          <td>{d.formula_result}</td>
                          <td>
                            <Button
                              type="is-warning"
                              title="Edit"
                              onClick={() => selectFormula(d)}
                              disabled={isSaving || isDeleting}
                            />
                            &nbsp;
                            <Button
                              type="is-danger"
                              title="Delete"
                              loading={isDeleting}
                              onClick={() => removeFormula(d.formula_id)}
                              disabled={isSaving || isDeleting}
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
