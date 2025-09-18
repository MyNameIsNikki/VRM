//https://github.com/xJleSx
import React, { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard/ItemCard';
import PriceFilter from '../components/filters/PriceFilter';
import CategoryFilter from '../components/filters/CategoryFilter';
import './ShopPage.css';

const ShopPage = ({ items, addToCart, isFiltersOpen, setIsFiltersOpen }) => {
  const [filtersActive, setFiltersActive] = useState(isFiltersOpen);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedHeroes, setSelectedHeroes] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedRarities, setSelectedRarities] = useState([]);
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [selectedHolds, setSelectedHolds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openedCategories, setOpenedCategories] = useState({
    price: true,
    type: false,
    hero: false,
    slot: false,
    rarity: false,
    quality: false,
    hold: false
  });

  useEffect(() => {
    setFiltersActive(isFiltersOpen);
  }, [isFiltersOpen]);

  // Создаем массив всех предложений из всех товаров
  const allOffers = items.flatMap(item => 
    item.offers.map(offer => ({
      ...item,
      price: offer.price, // Заменяем цену товара на цену предложения
      seller: offer.seller // Заменяем продавца товара на продавца предложения
    }))
  );

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

  const toggleCategory = (category) => {
    setOpenedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedTypes([]);
    setSelectedHeroes([]);
    setSelectedSlots([]);
    setSelectedRarities([]);
    setSelectedQualities([]);
    setSelectedHolds([]);
    setSearchQuery('');
  };

  // Получаем уникальные значения для каждого фильтра из items
  const unique = (array) => Array.from(new Set(array));

  // Фильтруем предложения
  const filteredOffers = allOffers.filter(offerItem => {
    // Фильтрация по цене
    const minPrice = parseFloat(priceRange.min);
    const maxPrice = parseFloat(priceRange.max);
    
    if (!isNaN(minPrice) && offerItem.price < minPrice) return false;
    if (!isNaN(maxPrice) && offerItem.price > maxPrice) return false;
    
    // Остальные фильтры
    if (selectedTypes.length > 0 && !selectedTypes.includes(offerItem.type)) return false;
    if (selectedHeroes.length > 0 && !selectedHeroes.includes(offerItem.hero)) return false;
    if (selectedSlots.length > 0 && !selectedSlots.includes(offerItem.slot)) return false;
    if (selectedRarities.length > 0 && !selectedRarities.includes(offerItem.rarity)) return false;
    if (selectedQualities.length > 0 && !selectedQualities.includes(offerItem.quality)) return false;
    if (selectedHolds.length > 0 && !selectedHolds.includes(offerItem.hold)) return false;
    if (searchQuery && !offerItem.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Проверяем, применены ли какие-либо фильтры
  const areFiltersApplied = () => {
    return priceRange.min || priceRange.max || 
           selectedTypes.length > 0 || 
           selectedHeroes.length > 0 || 
           selectedSlots.length > 0 || 
           selectedRarities.length > 0 || 
           selectedQualities.length > 0 || 
           selectedHolds.length > 0 || 
           searchQuery;
  };

  const handleFiltersToggle = () => {
    const newState = !filtersActive;
    setFiltersActive(newState);
    setIsFiltersOpen(newState);
  };

  return (
    <div className="content-container">
      <div className="filters-panel">
        <div 
          className="filters-header" 
          onClick={handleFiltersToggle}
        >
          <h3><i className="fas fa-filter"></i> Фильтры</h3>
          <i className={`fas fa-chevron-${filtersActive ? 'up' : 'down'}`}></i>
        </div>
        
        {filtersActive && (
          <div className="filter-categories">
            <PriceFilter 
              priceRange={priceRange} 
              setPriceRange={setPriceRange}
              isOpen={openedCategories.price}
              toggleCategory={() => toggleCategory('price')}
            />
            
            <CategoryFilter 
              title="Тип"
              items={unique(items.map(item => item.type))}
              selectedItems={selectedTypes}
              toggleItem={(value) => toggleFilter('type', value)}
              isOpen={openedCategories.type}
              toggleCategory={() => toggleCategory('type')}
            />
            
            <CategoryFilter 
              title="Герой"
              items={unique(items.map(item => item.hero))}
              selectedItems={selectedHeroes}
              toggleItem={(value) => toggleFilter('hero', value)}
              isOpen={openedCategories.hero}
              toggleCategory={() => toggleCategory('hero')}
            />
            
            <CategoryFilter 
              title="Слот"
              items={unique(items.map(item => item.slot))}
              selectedItems={selectedSlots}
              toggleItem={(value) => toggleFilter('slot', value)}
              isOpen={openedCategories.slot}
              toggleCategory={() => toggleCategory('slot')}
            />
            
            <CategoryFilter 
              title="Раритетность"
              items={unique(items.map(item => item.rarity))}
              selectedItems={selectedRarities}
              toggleItem={(value) => toggleFilter('rarity', value)}
              isOpen={openedCategories.rarity}
              toggleCategory={() => toggleCategory('rarity')}
            />
            
            <CategoryFilter 
              title="Качество"
              items={unique(items.map(item => item.quality))}
              selectedItems={selectedQualities}
              toggleItem={(value) => toggleFilter('quality', value)}
              isOpen={openedCategories.quality}
              toggleCategory={() => toggleCategory('quality')}
            />
            
            <CategoryFilter 
              title="Холд"
              items={unique(items.map(item => item.hold))}
              selectedItems={selectedHolds}
              toggleItem={(value) => toggleFilter('hold', value)}
              isOpen={openedCategories.hold}
              toggleCategory={() => toggleCategory('hold')}
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
        
        {filteredOffers.length > 0 ? (
          <div className="items-grid">
            {filteredOffers.map((offerItem, index) => (
              <ItemCard 
                key={`${offerItem.id}-${offerItem.seller}-${index}`} 
                item={offerItem} 
                addToCart={addToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="no-items-container">
            <div className="no-items-message">
              {areFiltersApplied() ? (
                <>
                  <i className="fas fa-search fa-3x"></i>
                  <h3>Ничего не найдено</h3>
                  <p>Попробуйте изменить параметры фильтрации или сбросить фильтры</p>
                  <button className="reset-filters-btn" onClick={resetFilters}>
                    Сбросить фильтры
                  </button>
                </>
              ) : (
                <>
                  <i className="fas fa-box-open fa-3x"></i>
                  <h3>Товары отсутствуют</h3>
                  <p>В данный момент в магазине нет доступных товаров</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
