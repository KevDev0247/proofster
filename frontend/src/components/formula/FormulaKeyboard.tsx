import { Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { IFormula } from '../../models/formula';
import { setInputMode, setSelected } from '../../slices/formulaSlice';
import { AppDispatch, RootState, useAppDispatch } from '../../store';


interface IKeyboardButton {
  label: string;
  value: string;
}
const keyboardOne: IKeyboardButton[] = [
  { label: '(', value: ' ( ' },
  { label: ')', value: ' ) ' },
  { label: '¬', value: ' ¬ ' },
  { label: '∀', value: ' ∀' },
  { label: '∃', value: ' ∃' },
];
const keyboardTwo: IKeyboardButton[] = [
  { label: '∨', value: ' ∨ ' },
  { label: '∧', value: ' ∧ ' },
  { label: '⇒', value: ' ⇒ ' },
  { label: '⇔', value: ' ⇔ ' },
  { label: 'F(x)', value: ' F( ) ' },
];
const keyboardSetting: IKeyboardButton[] = [
  { label: 'Infix', value: 'Infix' },
  { label: 'Postfix', value: 'Postfix' },
  { label: 'Natural', value: 'Natural' },
];


export default function FormulaKeyboard(
  props: {
    formulaInfixRef: React.RefObject<HTMLInputElement>,
    isSmDown: boolean
  }
) {
  const { formulaInfixRef, isSmDown } = props;

  const dispatch: AppDispatch = useAppDispatch();

  const inputMode: string = useSelector(
    (state: RootState) => state.formula.save.inputMode
  );
  const selected: IFormula = useSelector(
    (state: RootState) => state.formula.save.selected
  );
  const cursorPositionRef = useRef<number>(0);

  useEffect(() => {
    const handleCursorPositionChange = () => {
      const newCursorPosition = formulaInfixRef.current?.selectionStart || 0;
      cursorPositionRef.current = newCursorPosition;
    };
    if (formulaInfixRef.current) {
      formulaInfixRef.current.addEventListener('click', handleCursorPositionChange);
      formulaInfixRef.current.addEventListener('keyup', handleCursorPositionChange);
      return () => {
        formulaInfixRef.current?.removeEventListener('click', handleCursorPositionChange);
        formulaInfixRef.current?.removeEventListener('keyup', handleCursorPositionChange);
      };
    }
  }, []);


  const handleInputModeSelection = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string,
  ): void => {
    dispatch(setInputMode(value));
  }

  const handleKeyboardClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    value: string,
  ): void => {
    const inputElement = formulaInfixRef.current;
    if (inputElement) {
      const cursorPosition = cursorPositionRef.current;
      const currentInfix = selected.formula_infix;

      const newInfix =
        currentInfix.substring(0, cursorPosition) +
        value +
        currentInfix.substring(cursorPosition);

      dispatch(setSelected({
        ...selected,
        formula_infix: newInfix,
      }));

      const newCursorPosition = cursorPosition + value.length;
      cursorPositionRef.current = newCursorPosition;
      inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }
  }


  return (
    <>
      <Grid item xs={12} md={3.5}>
        <ToggleButtonGroup
          size="small"
          value={inputMode}
          onChange={handleInputModeSelection}
          aria-label="special symbol group one"
          exclusive
        >
          {keyboardSetting.map(({ label, value }) => (
            <ToggleButton key={label} value={value} sx={{ width: 66, textTransform: 'none' }}>
              <Typography variant="body2"><strong>{label}</strong></Typography>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
      {
        inputMode === "Infix" && (
          <>
            <Grid item xs={12} md={4}>
              {isSmDown ? (
                <ToggleButtonGroup
                  size="large"
                  onChange={handleKeyboardClick}
                  aria-label="special symbol group one"
                  exclusive
                >
                  {keyboardOne.map(({ label, value }) => (
                    <ToggleButton key={label} value={value} sx={{ width: 66, textTransform: 'none' }}>
                      <Typography variant="h5"><strong>{label}</strong></Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ) : (
                <ToggleButtonGroup
                  size="small"
                  onChange={handleKeyboardClick}
                  aria-label="special symbol group one"
                  exclusive
                >
                  {keyboardOne.map(({ label, value }) => (
                    <ToggleButton key={label} value={value} sx={{ width: 46, textTransform: 'none' }}>
                      <Typography variant="body1"><strong>{label}</strong></Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              {isSmDown ? (
                <ToggleButtonGroup
                  size="large"
                  onChange={handleKeyboardClick}
                  aria-label="special symbol group two"
                  exclusive
                >
                  {keyboardTwo.map(({ label, value }) => (
                    <ToggleButton key={label} value={value} sx={{ width: 66, textTransform: 'none' }}>
                      <Typography variant="h5"><strong>{label}</strong></Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              ) : (
                <ToggleButtonGroup
                  size="small"
                  onChange={handleKeyboardClick}
                  aria-label="special symbol group two"
                  exclusive
                >
                  {keyboardTwo.map(({ label, value }) => (
                    <ToggleButton key={label} value={value} sx={{ width: 46, textTransform: 'none' }}>
                      <Typography variant="body1"><strong>{label}</strong></Typography>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              )}
            </Grid>
          </>
        )
      }
    </>
  )
}

