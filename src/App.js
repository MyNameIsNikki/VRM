import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ItemDetailPage from './pages/ItemDetailPage';
import HelpPage from './pages/HelpPage';
import CartModal from './components/modals/CartModal';
import InfoModal from './components/modals/InfoModal';
import items from './data/items';
import vrmLogo from './assets/VRM.png';
import exaltedFeast from './assets/Exalted Feast of Abscession - Back.svg';
import goldencrucibleofrile from './assets/Golden Crucible of Rile.svg';
import headoftheodobenusone from './assets/Head of the Odobenus One.svg';
import { secureStorage } from './components/utils/secureStorage';

Modal.setAppElement('#root');

function App() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState({ type: null });
  const [cartModalIsOpen, setCartModalIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  const [recentlySold, setRecentlySold] = useState([
    { id: 1, name: "Exalted Feast of Abscession - Back", price: 39.72, image: exaltedFeast },
    { id: 2, name: "Golden Crucible of Rile", price: 39.56, image: goldencrucibleofrile },
    { id: 3, name: "Head of the Odobenus One", price: 12.92, image: headoftheodobenusone },
  ]);
  
  const [statsData, setStatsData] = useState({
    totalSold: "3",
    totalReviews: "1",
    averageRating: "4.8"
  });

  // Функция для обновления токенов
  const refreshTokenIfNeeded = () => {
    const token = secureStorage.getItem('authToken');
    const loginTime = secureStorage.getItem('loginTime');
    const currentTime = new Date().getTime();
    
    // Обновляем токен если осталось меньше 4 часов
    if (token && loginTime && (currentTime - parseInt(loginTime)) > 20 * 60 * 60 * 1000) {
      const newToken = 'demo-auth-token-' + Math.random().toString(36).substr(2);
      secureStorage.setItem('authToken', newToken);
      secureStorage.setItem('loginTime', new Date().getTime());
    }
  };

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = secureStorage.getItem('authToken');
      const loginTime = secureStorage.getItem('loginTime');
      const currentTime = new Date().getTime();
      
      // Если токен существует и не истек срок (24 часа)
      if (token && loginTime && (currentTime - parseInt(loginTime)) < 24 * 60 * 60 * 1000) {
        setIsLoggedIn(true);
      } else {
        // Очищаем устаревшие данные
        secureStorage.removeItem('authToken');
        secureStorage.removeItem('loginTime');
        secureStorage.removeItem('login_username');
        secureStorage.removeItem('login_remember');
        setIsLoggedIn(false);
      }
      refreshTokenIfNeeded();
    };

    checkAuthStatus();

    // Добавим базовые настройки безопасности
    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');
    document.head.appendChild(metaCharset);
    
    const metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    metaViewport.setAttribute('http-equiv', 'Content-Security-Policy', "default-src 'self'");
    document.head.appendChild(metaViewport);
    
    // Добавляем CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:");
    document.head.appendChild(cspMeta);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    const showTime = () => {
      const timeElement = document.getElementById('currentTime');
      if (timeElement) {
        timeElement.textContent = new Date().toUTCString();
      }
    };
    
    showTime();
    const interval = setInterval(showTime, 1000);

    // Периодическая проверка авторизации каждые 10 минут
    const authCheckInterval = setInterval(checkAuthStatus, 10 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      clearInterval(authCheckInterval);
    };
  }, []);

  // Функция для входа пользователя
  const handleLogin = (token) => {
    secureStorage.setItem('authToken', token);
    secureStorage.setItem('loginTime', new Date().getTime());
    setIsLoggedIn(true);
  };

  // Функция для выхода пользователя
  const handleLogout = () => {
    secureStorage.removeItem('authToken');
    secureStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    setCart([]);
    navigate('/');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const openModal = (type) => {
    setModalIsOpen({ type });
  };

  const closeModal = () => {
    setModalIsOpen({ type: null });
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="logo-loader">
          <div className="logo" style={{ backgroundImage: `url(${vrmLogo})` }}></div>
        </div>
        <p id="currentTime" style={{ color: 'white' }}></p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header 
        openModal={openModal}
        setCartModalIsOpen={setCartModalIsOpen}
        cart={cart}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
      
      <Routes>
        <Route path="/" element={
          <HomePage 
            filteredItems={filteredItems}
            addToCart={addToCart}
            handleSearchChange={handleSearchChange}
            searchQuery={searchQuery}
            openModal={openModal}
            recentlySold={recentlySold}
            statsData={statsData}
            isLoggedIn={isLoggedIn}
          />
        } />
        <Route path="/shop" element={
          isLoggedIn ? (
            <ShopPage 
              items={items} 
              addToCart={addToCart} 
            />
          ) : (
            <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
              <h2>Доступ запрещен</h2>
              <p>Для доступа к магазину необходимо авторизоваться</p>
              <button 
                onClick={() => openModal('login')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(to right, #cc0000, #990000)',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Войти
              </button>
            </div>
          )
        } />
        <Route path="/item/:id" element={
          isLoggedIn ? (
            <ItemDetailPage 
              items={items} 
              addToCart={addToCart} 
            />
          ) : (
            <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
              <h2>Доступ запрещен</h2>
              <p>Для доступа к странице товара необходимо авторизоваться</p>
              <button 
                onClick={() => openModal('login')}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(to right, #cc0000, #990000)',
                  border: 'none',
                  borderRadius: '5px',
                  color: 'white',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Войти
              </button>
            </div>
          )
        } />
        <Route path="/help" element={
          <HelpPage 
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getTotalPrice={getTotalPrice}
            openModal={openModal}
            isLoggedIn={isLoggedIn}
          />
        } />
      </Routes>

      <footer>
        © 2025 VRM. Все права защищены.
      </footer>

      <InfoModal 
        isOpen={modalIsOpen.type !== null} 
        onRequestClose={closeModal}
        type={modalIsOpen.type}
      />
      
      <CartModal 
        isOpen={cartModalIsOpen}
        onRequestClose={() => setCartModalIsOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
      />
    </div>
  );
}

export default App;