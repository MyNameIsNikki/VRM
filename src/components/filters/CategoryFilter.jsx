//https://github.com/xJleSx
import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({ title, items, selectedItems, toggleItem, isOpen, toggleCategory }) => {
  return (
    <div className={`filter-category ${isOpen ? 'opened' : ''}`}>
      <div className="category-title" onClick={toggleCategory}>
        {title}
        <span className="category-title-counter">{selectedItems.length}</span>
      </div>
      {isOpen && (
        <div className="category-content">
          <div className="checkboxes-list">
            <div className="checkboxes-list-scroll">
              {items.map((item, index) => (
                <div className="checkbox" key={index}>
                  <input 
                    type="checkbox" 
                    id={`${title}_${index}`}
                    checked={selectedItems.includes(item)}
                    onChange={() => toggleItem(item)}
                  />
                  <label htmlFor={`${title}_${index}`}>{item}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;