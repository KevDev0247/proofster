type Props = {
  loading?: boolean;
  type?: string;
  title: string;
  onClick: React.SyntheticEvent | any;
  disabled?: boolean;
};

function Button ({
  loading,
  type,
  title,
  onClick,
  disabled,
}: Props) {
  return (
    <button
      className={
        loading ? "button is-small is-loading": "button is-small" + type
      }
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </button>
  );
};

export default Button;
