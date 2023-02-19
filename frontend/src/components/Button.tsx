import { Button, CircularProgress, useTheme } from '@material-ui/core';

type Props = {
  loading?: boolean;
  type?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "error";
  title: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

function ProofsterButton({
  loading,
  type = "contained",
  color = "primary",
  title,
  onClick,
  disabled,
}: Props) {
  return (
    <Button
      variant={type}
      color={color}
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={loading && <CircularProgress size={20} />}
    >
      {title}
    </Button>
  );
}

export default ProofsterButton;