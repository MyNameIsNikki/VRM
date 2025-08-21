import React from 'react';
import './/Benefits.css';

const Benefits = ({ openModal }) => {
  return (
    <div className="full-width benefits-container">
      <div className="benefits-content">
        <div className="benefits">
          <button className="benefit-item" onClick={() => openModal('reliability')}>
            <i className="fas fa-shield-alt benefit-icon"></i>
            <span>НАДЁЖНОСТЬ</span>
          </button>
          <button className="benefit-item" onClick={() => openModal('security')}>
            <i className="fas fa-lock benefit-icon"></i>
            <span>БЕЗОПАСНОСТЬ</span>
          </button>
          <button className="benefit-item" onClick={() => openModal('profit')}>
            <i className="fas fa-dollar-sign benefit-icon"></i>
            <span>ВЫГОДА</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Benefits;