import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from './../store';
import { createFormula, deleteFormula, getFormulas, updateFormula } from './formulaApi';
import { IFormula } from './../models/formula';
import { toast } from 'react-toastify';

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
    content: "",
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
      content: d.content,
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

    if (formula.name == "") {
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
      content: "",
      isConclusion: false,
    });
    setShowValidation(false);
  };

  return (
    <>
      <div className="form-container">
        <h1 className="title">
          Formula &nbsp;
          <span className="tag is-link">{formulaList?.length}</span>
        </h1>
      </div>
    </>
  )
}
