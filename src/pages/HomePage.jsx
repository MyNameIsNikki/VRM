import React from 'react';
import ItemCard from '../components/ItemCard/ItemCard';
import SearchBar from '../components/SearchBar/SearchBar';
import Benefits from '../components/Benefits/Benefits';
import './HomePage.css';

const HomePage = ({ filteredItems, addToCart, handleSearchChange, searchQuery, openModal }) => {
  return (
    <div>
      <div className="full-width title-block">
        ПРОДАЖА И ПОКУПКА ВЕЩЕЙ ИЗ DOTA 2
      </div>

      <Benefits openModal={openModal} />

      <SearchBar 
        searchQuery={searchQuery} 
        handleSearchChange={handleSearchChange} 
      />
      
      <div className="items-grid container">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;