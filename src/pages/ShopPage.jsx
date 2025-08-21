import React, { useState } from 'react';
import ItemCard from '../components/ItemCard/ItemCard';
import PriceFilter from '../components/filters/PriceFilter';
import CategoryFilter from '../components/filters/CategoryFilter';
import './ShopPage.css';

const ShopPage = ({ items, addToCart }) => {
  const [filtersActive, setFiltersActive] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [selectedHolds, setSelectedHolds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFilter = (filterType, value) => {
    switch (filterType) {
      case 'type':
        setSelectedTypes(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'hero':
        setSelectedHeroes(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'slot':
        setSelectedSlots(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'rarity':
        setSelectedRarities(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'quality':
        setSelectedQualities(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      case 'hold':
        setSelectedHolds(prev => 
          prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
        break;
      default:
        break;
    }
  };

  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedTypes([]);
    setSelectedHeroes([]);
    setSelectedSlots([]);
    setSelectedRarities([]);
    setSelectedQualities([]);
    setSelectedHolds([]);
  };

  const filteredItems = items.filter(item => {
    if (priceRange.min && item.price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && item.price > parseFloat(priceRange.max)) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(item.type)) return false;
    if (selectedHeroes.length > 0 && !selectedHeroes.includes(item.hero)) return false;
    if (selectedSlots.length > 0 && !selectedSlots.includes(item.slot)) return false;
    if (selectedRarities.length > 0 && !selectedRarities.includes(item.rarity)) return false;
    if (selectedQualities.length > 0 && !selectedQualities.includes(item.quality)) return false;
    if (selectedHolds.length > 0 && !selectedHolds.includes(item.hold)) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="content-container">
      <div className="filters-panel">
        <div 
          className="filters-header" 
          onClick={() => setFiltersActive(!filtersActive)}
        >
          <h3><i className="fas fa-filter"></i> Фильтры</h3>
          <i className={`fas fa-chevron-${filtersActive ? 'up' : 'down'}`}></i>
        </div>
        
        {filtersActive && (
          <div className="filter-categories">
            <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
            
            <CategoryFilter 
              title="Тип"
              items={['Билет', 'Украшение']}
              selectedItems={selectedTypes}
              toggleItem={(value) => toggleFilter('type', value)}
            />
            
            <CategoryFilter 
              title="Герой"
              items={['Pudge', 'Phantom Assassin', 'Shadow Fiend', 'Anti-Mage']}
              selectedItems={selectedHeroes}
              toggleItem={(value) => toggleFilter('hero', value)}
            />
            
            <CategoryFilter 
              title="Слот"
              items={['Оружие', 'Плечо', 'Спина', 'Голова']}
              selectedItems={selectedSlots}
              toggleItem={(value) => toggleFilter('slot', value)}
            />
            
            <CategoryFilter 
              title="Раритетность"
              items={['Immortal']}
              selectedItems={selectedRarities}
              toggleItem={(value) => toggleFilter('rarity', value)}
            />
            
            <CategoryFilter 
              title="Качество"
              items={['Standard', 'Exalted', 'Golden']}
              selectedItems={selectedQualities}
              toggleItem={(value) => toggleFilter('quality', value)}
            />
            
            <CategoryFilter 
              title="Холд"
              items={['Без холда', '7 дней']}
              selectedItems={selectedHolds}
              toggleItem={(value) => toggleFilter('hold', value)}
            />
            
            <button className="reset-filters" onClick={resetFilters}>Сбросить фильтры</button>
          </div>
        )}
      </div>
      
      <div className="main-content">
        <div className="search-container">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              className="search-text" 
              placeholder="Поиск предметов..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} addToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;