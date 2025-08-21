import React from 'react';
import './/SearchBar.css';

const SearchBar = ({ searchQuery, handleSearchChange }) => {
  return (
    <div className="search">
      <div className="search-box">
        <i className="fas fa-search"></i>
        <input
          type="text"
          className="search-text"
          placeholder="Поиск предметов..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;