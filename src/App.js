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
import exaltedFeast from './assets/Exalted Feast of Abscession - Back.svg';
import goldencrucibleofrile from './assets/Golden Crucible of Rile.svg';
import headoftheodobenusone from './assets/Head of the Odobenus One.svg';
import { secureStorage } from './components/utils/secureStorage';

Modal.setAppElement('#root');

function App() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState({ type: null });
  const [cartModalIsOpen, setCartModalIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [recentlySold] = useState([
    { id: 1, name: "Exalted Feast of Abscession - Back", price: 39.72, image: exaltedFeast },
    { id: 2, name: "Golden Crucible of Rile", price: 39.56, image: goldencrucibleofrile },
    { id: 3, name: "Head of the Odobenus One", price: 12.92, image: headoftheodobenusone },
  ]);

  const [statsData] = useState({
    totalSold: "3",
    totalReviews: "1",
    averageRating: "4.8"
  });

  // Функция для обновления токенов
  const refreshTokenIfNeeded = () => {
    const token = secureStorage.getItem('authToken');
    const loginTime = secureStorage.getItem('loginTime');
    const currentTime = new Date().getTime();

    console.log('refreshTokenIfNeeded: token=', token, 'loginTime=', loginTime); // Отладка

    if (token && loginTime && !isNaN(parseInt(loginTime)) && (currentTime - parseInt(loginTime)) > 20 * 60 * 60 * 1000) {
      const newToken = 'demo-auth-token-' + Math.random().toString(36).substr(2);
      secureStorage.setItem('authToken', newToken);
      secureStorage.setItem('loginTime', currentTime.toString());
      console.log('Token refreshed: newToken=', newToken); // Отладка
    }
  };

  // Проверка авторизации
  useEffect(() => {
    // Добавление мета-тегов
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewportMeta);

    const cspMeta = document.createElement('meta');
    cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
    cspMeta.setAttribute('content', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; img-src 'self' data:;");
    document.head.appendChild(cspMeta);

    // Проверка авторизации
    const checkAuthStatus = () => {
      const token = secureStorage.getItem('authToken');
      const loginTime = secureStorage.getItem('loginTime');
      const currentTime = new Date().getTime();

      console.log('checkAuthStatus: token=', token, 'loginTime=', loginTime, 'isLoggedIn=', isLoggedIn); // Отладка

      if (token && loginTime && !isNaN(parseInt(loginTime)) && (currentTime - parseInt(loginTime)) < 24 * 60 * 60 * 1000) {
        setIsLoggedIn(true);
      } else {
        secureStorage.removeItem('authToken');
        secureStorage.removeItem('loginTime');
        secureStorage.removeItem('login_username');
        secureStorage.removeItem('login_remember');
        setIsLoggedIn(false);
        console.log('Auth cleared: invalid or expired token'); // Отладка
      }
    };

    checkAuthStatus();
    refreshTokenIfNeeded();
  }, []);

  const handleLogin = (token) => {
    console.log('handleLogin: token=', token); // Отладка
    setIsLoggedIn(true);
    secureStorage.setItem('authToken', token);
    secureStorage.setItem('loginTime', new Date().getTime().toString());
  };

  const handleLogout = () => {
    console.log('handleLogout called'); // Отладка
    setIsLoggedIn(false);
    secureStorage.removeItem('authToken');
    secureStorage.removeItem('loginTime');
    secureStorage.removeItem('login_username');
    secureStorage.removeItem('login_remember');
    navigate('/');
  };

  const openModal = (type) => {
    setModalIsOpen({ type });
  };

  const closeModal = () => {
    setModalIsOpen({ type: null });
  };

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

const removeFromCart = (itemId, removeAll = false) => {
  if (removeAll) {
    // Удалить все элементы с этим ID
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  } else {
    // Удалить только один элемент (первый найденный)
    setCart((prevCart) => {
      const index = prevCart.findIndex((item) => item.id === itemId);
      if (index === -1) return prevCart;
      
      const newCart = [...prevCart];
      newCart.splice(index, 1);
      return newCart;
    });
  }
};

const clearCart = () => {
  setCart([]);
};

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
            setCartModalIsOpen={setCartModalIsOpen}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            onLogin={handleLogin}
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
        clearCart={clearCart} // Добавьте эту строку
      />
    </div>
  );
}

export default App;