import React from 'react';

const SensitiveDataMask = ({ data, visible = false, maskChar = '•', revealLength = 0 }) => {
  if (!data) return null;
  
  const maskData = (value) => {
    if (visible) return value;
    
    if (revealLength > 0) {
      const visiblePart = value.slice(0, revealLength);
      const maskedPart = maskChar.repeat(value.length - revealLength);
      return visiblePart + maskedPart;
    }
    
    return maskChar.repeat(value.length);
  };
  
  return (
    <span className="sensitive-data">
      {maskData(data)}
    </span>
  );
};

export default SensitiveDataMask;