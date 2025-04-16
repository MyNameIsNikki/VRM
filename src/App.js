import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <i className="fas fa-shield-alt"></i>
          <span>Dota Marketplace</span>
        </div>
        <nav className="nav">
          <Link to="/discounts"><i className="fas fa-tags"></i> Продать скины</Link>
          <Link to="/buy-discounts"><i className="fas fa-shopping-bag"></i> Купить скины</Link>
          <Link to="/faq"><i className="fas fa-question-circle"></i> FAQ</Link>
          <Link to="/cart"><i className="fas fa-shopping-cart"></i> Корзина</Link>
          <div className="auth-buttons">
            <Link to="/login" className="sign-in">Войти</Link>
            <Link to="/register" className="register">Регистрация</Link>
          </div>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h1>ПРОДАЖА И ПОКУПКА ВЕЩЕЙ ИЗ DOTA 2</h1>
        </section>

        <aside className="sidebar">
          <Link to="/benefits"><i className="fas fa-chevron-down"></i> ЧТО ВЫ ПОЛУЧАЕТЕ?</Link>
          <Link to="/reliability"><i className="fas fa-thumbs-up"></i> НАДЁЖНОСТЬ</Link>
          <Link to="/safety"><i className="fas fa-lock"></i> БЕЗОПАСНОСТЬ</Link>
          <Link to="/profits"><i className="fas fa-dollar-sign"></i> ВЫГОДУ</Link>
        </aside>

        <section className="search">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Hinted search text"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button><i className="fas fa-search"></i></button>
          </div>
        </section>

        <section className="items-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <article key={item.id} className="item-card">
                {item.image && <img src={item.image} alt={item.name} className="item-image" />}
                <h3>{item.name}</h3>
                <p className="price">{item.price} P</p>
                <button className="add-to-cart">
                  <i className="fas fa-shopping-cart"></i> В КОРЗИНУ
                </button>
              </article>
            ))
          ) : (
            <p className="no-items">Товары не найдены.</p>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Dota Marketplace. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default App;