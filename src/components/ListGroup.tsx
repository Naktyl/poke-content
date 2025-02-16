import { MouseEvent, useState } from "react";
function ListGroup() {
  let items = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [name, setName] = useState("");

  const handleClick = (event: MouseEvent, index: number) => {
    console.log(event.pageX, event.pageY, index);
    setSelectedIndex(index);
  };
  return (
    <>
      <h1>List</h1>
      {items.length === 0 && <p>No items</p>}
      <ul className="list-group ">
        {items.map((item, index) => {
          return (
            <li
              className={
                selectedIndex === index
                  ? "list-group-item active"
                  : "list-group-item"
              }
              key={index}
              onClick={(event) => handleClick(event, index)}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default ListGroup;
