import React from 'react';
import './PriceFilter.css';

const PriceFilter = ({ priceRange, setPriceRange }) => {
  return (
    <div className="filter-category">
      <div className="category-title">
        Цена
        <span className="category-title-counter">
          {(priceRange.min || priceRange.max) ? 1 : 0}
        </span>
      </div>
      <div className="category-content">
        <div className="grouped-input grouped-input--two-fields">
          <div className="filter-input">
            <input 
              type="text" 
              placeholder="Цена от" 
              value={priceRange.min}
              onChange={e => setPriceRange({...priceRange, min: e.target.value})}
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
              onChange={e => setPriceRange({...priceRange, max: e.target.value})}
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
    </div>
  );
};

export default PriceFilter;