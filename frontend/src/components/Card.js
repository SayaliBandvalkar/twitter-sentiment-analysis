import React from "react";
import "../styles/Card.css";


const Card = ({ children }) => {
  return <div className="p-4 bg-white shadow-md rounded-lg">{children}</div>;
};

export default Card;
