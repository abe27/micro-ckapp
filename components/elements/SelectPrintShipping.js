const SelectPrintShipping = ({ id, isChecked = false, selectShipping }) => {
  // console.dir(`ID: ${id} PROPS: ${isChecked}`);
  return (
    <>
      <span className="hover:cursor-pointer">
        <input
          type="checkbox"
          className="checkbox checkbox-xs checkbox-warning"
          id={id}
          checked={isChecked}
          onChange={selectShipping}
        />
      </span>
    </>
  );
};

export default SelectPrintShipping;
