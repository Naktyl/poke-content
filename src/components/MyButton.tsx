interface Props {
  children: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  onButtonClicked: () => void;
}
const MyButton = ({ children, color = "primary", onButtonClicked }: Props) => {
  return (
    <div>
      <button
        type="button"
        className={"btn btn-" + color}
        onClick={onButtonClicked}
      >
        {children}
      </button>
    </div>
  );
};

export default MyButton;
