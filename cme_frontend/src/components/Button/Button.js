import React from 'react';
import './Button.css';

const Button = ({ label, onClick, variant = 'primary' }) => (
  <button className={`btn btn-${variant}`} onClick={onClick}>
    {label}
  </button>
);

export default Button;
