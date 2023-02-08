import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from './../store';
import { createFormula, deleteFormula, getFormulas, updateFormula } from './formulaApi';
import { IFormula } from './../models/formula';
import { toast } from 'react-toastify';
import Checkbox from '../components/Checkbox';
import Input from '../components/Input';

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
    formulaId: 0,
    name: "",
    formula_raw: "",
    isConclusion: false,
  });
  const [showValidation, setShowValidation] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormula((prevState) => ({
      ...prevState,
      [name]: name === "isActive" ? checked : value,
    }));
  };

  const selectFormula = (d: IFormula) => {
    setShowValidation(false);
    setFormula({
      formulaId: d.formulaId,
      name: d.name,
      formula_raw: d.formula_raw,
      isConclusion: d.isConclusion,
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
      formula.formulaId === 0 
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
      formulaId: 0,
      name: "",
      formula_raw: "",
      isConclusion: false,
    });
    setShowValidation(false);
  };

  return (
    <>
      <div className="form-container">
        <h1 className="title">
          Arguments Panel &nbsp;
          <span className="tag is-link">{formulaList?.length}</span>
        </h1>
        <div className="card">
          <div className="card-content">
            <div className="content">
              <div className="columns">
                <div className="column is-4">
                  <Checkbox
                    title="Conclusion"
                    name="isConclusion"
                    value={formula.isConclusion}
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
                    title="Reverse Polish Notation"
                    name="name"
                    placeholder="Enter formula in reverse polish notation"
                    value={formula.formula_raw}
                    inputChange={handleInputChange}
                    showValidation={showValidation}
                    isRequired={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
