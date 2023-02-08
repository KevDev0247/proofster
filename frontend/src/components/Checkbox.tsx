type Props = {
  title: string;
  name: string;
  value: boolean;
  inputChange: void | any;
};

function Checkbox({
  title,
  name,
  value,
  inputChange,
}: Props) {
  return (
    <>
      <div className="control">
        <label className="checkbox">
          <input 
            type="checkbox" 
            name={name}
            onChange={inputChange}
            checked={value}
          />
          &nbsp;&nbsp;
          <span style={{ fontWeight: "bold", fontSize: "16px" }}>{title}</span>
        </label>
      </div>
    </>
  );
}

export default Checkbox;
