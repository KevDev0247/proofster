import TextField from '@material-ui/core/TextField';

type Props = {
  name: string;
  value: any;
  inputChange: void | any;
  placeholder?: string;
  title: string;
  showValidation?: boolean;
  type: string;
  isRequired?: boolean;  
};

function Input({
  name,
  value,
  inputChange,
  placeholder,
  title,
  showValidation,
  type,
  isRequired,
}: Props) {
  return (
    <>
      <TextField
        id={name}
        name={name}
        label={title}
        variant="outlined"
        type={type}
        value={value}
        onChange={inputChange}
        placeholder={placeholder}
        fullWidth
        error={showValidation && isRequired}
        helperText={showValidation && isRequired && `${title} is required`}
      />
    </>
  );
}

export default Input;