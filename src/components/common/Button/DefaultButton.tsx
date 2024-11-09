
const DefaultButton = (props:{label:string, clickEvent?:any}) => {
  return (
    <button
      style={{ height: 50 }}
      className="flex items-center justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-80"
      onClick={() => props.clickEvent("month")}
    >
      {props.label}
    </button>
  );
};

export default DefaultButton;