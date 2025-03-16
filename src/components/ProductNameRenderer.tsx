import React from 'react';
import { ProductNameRendererProps } from '../types';

const ProductNameRenderer: React.FC<ProductNameRendererProps> = (props) => {
  return (
    <div>
      <img
        src={props.data.image}
        alt={props.data.name}
        height="100" // Fixed height
        style={{ width: "auto", marginRight: "5px" }} // Maintain aspect ratio
      />
      {props.data.name}
    </div>
  );
};

export default ProductNameRenderer;
