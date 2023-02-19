import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

type Props = {
  title: string;
  name: string;
  value: boolean;
  inputChange: void | any;
};

function ProofsterCheckbox({
  title,
  name,
  value,
  inputChange,
}: Props) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          name={name}
          color="primary"
          onChange={inputChange}
        />
      }
      label={title}
    />
  );
}

export default ProofsterCheckbox;