//https://github.com/xJleSx
import React from 'react';
import './ToastNotification.css';

const ToastNotification = ({ message, isVisible }) => {
  return (
    <div className={`toast-notification ${isVisible ? 'show' : ''}`}>
      <span>✓</span> {message}
    </div>
  );
};

export default ToastNotification;