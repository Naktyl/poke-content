import React from 'react';
import { BoosterCellRendererProps } from '../types';

const BoosterCellRenderer: React.FC<BoosterCellRendererProps> = (props) => {
  const { boosters } = props.data;

  return (
    <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
      {boosters.map((booster, index) => (
        <span
          key={index}
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginRight: "8px",
            marginBottom: "5px", // Add margin to avoid overflow
          }}
        >
          <img
            src={booster.icon}
            alt={booster.name}
            height="30" // Fixed height
            style={{ width: "auto", marginRight: "5px" }} // Maintain aspect ratio
          />
          <strong>{booster.name}</strong>
          <span
            style={{
              backgroundColor: "#FF5C5C",
              color: "white",
              borderRadius: "50%",
              padding: "0 8px",
              fontSize: "12px",
              lineHeight: "20px",
              marginLeft: "5px",
            }} // Display the count of boosters
          >
            {booster.count}
          </span>
          {index < boosters.length - 1 && <span>, </span>}{" "}
        </span>
      ))}
    </div>
  );
};

export default BoosterCellRenderer;
