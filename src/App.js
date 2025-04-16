import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');

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

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user' && password === 'pass') {
      setIsLoggedIn(true);
      setLoginMessage('Успешный вход!');
      setShowLogin(false);
    } else {
      setLoginMessage('Неверное имя пользователя или пароль.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginMessage('');
    setUsername('');
    setPassword('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Простая проверка на заполнение полей и уникальность (временная реализация)
    if (username && email && password) {
      setRegisterMessage('Регистрация успешна! Вы можете войти.');
      setShowRegister(false);
      setUsername('');
      setEmail('');
      setPassword('');
    } else {
      setRegisterMessage('Заполните все поля.');
    }
  };

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
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout">Выйти</button>
            ) : (
              <>
                <button onClick={() => setShowLogin(true)} className="sign-in">Войти</button>
                <button onClick={() => setShowRegister(true)} className="register">Регистрация</button>
              </>
            )}
          </div>
        </nav>
      </header>

      {showLogin && (
        <div className="login-modal">
          <div className="login-content">
            <h2>Войти</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Войти</button>
              <button type="button" onClick={() => setShowLogin(false)}>Закрыть</button>
            </form>
            {loginMessage && <p>{loginMessage}</p>}
          </div>
        </div>
      )}

      {showRegister && (
        <div className="login-modal">
          <div className="login-content">
            <h2>Регистрация</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Зарегистрироваться</button>
              <button type="button" onClick={() => setShowRegister(false)}>Закрыть</button>
            </form>
            {registerMessage && <p>{registerMessage}</p>}
          </div>
        </div>
      )}

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