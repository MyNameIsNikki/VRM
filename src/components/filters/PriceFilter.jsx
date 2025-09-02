import React from 'react';
import './PriceFilter.css';

const PriceFilter = ({ priceRange, setPriceRange, isOpen, toggleCategory }) => {
  const handleChange = (field, value) => {

    let cleanedValue = value.replace(/[^0-9.,]/g, '');
    
    cleanedValue = cleanedValue.replace(/,/g, '.');
    
    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
      cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    setPriceRange(prev => ({ ...prev, [field]: cleanedValue }));
  };

  return (
    <div className={`filter-category ${isOpen ? 'opened' : ''}`}>
      <div className="category-title" onClick={toggleCategory}>
        Цена
        <span className="category-title-counter">
          {(priceRange.min || priceRange.max) ? 1 : 0}
        </span>
      </div>
      {isOpen && (
        <div className="category-content">
          <div className="grouped-input grouped-input--two-fields">
            <div className="filter-input">
              <input 
                type="text" 
                placeholder="Цена от" 
                value={priceRange.min}
                onChange={e => handleChange('min', e.target.value)}
                className="filter-input__input filter-input__input--has-currency price-field"
              />
              <div className="filter-input__icon-currency filter-input__icon-currency--rub">
                <i className="fa fa-rub"></i>
              </div>
              {priceRange.min && (
                <div 
                  className="filter-input__icon-clear"
                  onClick={() => setPriceRange({...priceRange, min: ''})}
                >
                  <i className="fa fa-times"></i>
                </div>
              )}
              <div className="filter-input__title">Цена от</div>
            </div>
            <div className="filter-input">
              <input 
                type="text" 
                placeholder="Цена до" 
                value={priceRange.max}
                onChange={e => handleChange('max', e.target.value)}
                className="filter-input__input filter-input__input--has-currency price-field"
              />
              <div className="filter-input__icon-currency filter-input__icon-currency--rub">
                <i className="fa fa-rub"></i>
              </div>
              {priceRange.max && (
                <div 
                  className="filter-input__icon-clear"
                  onClick={() => setPriceRange({...priceRange, max: ''})}
                >
                  <i className="fa fa-times"></i>
                </div>
              )}
              <div className="filter-input__title">Цена до</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;