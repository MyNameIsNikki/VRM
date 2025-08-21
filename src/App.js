import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Modal from 'react-modal';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ItemDetailPage from './pages/ItemDetailPage';
import HelpPage from './pages/HelpPage';
import InfoModal from './components/modals/InfoModal';
import AuthModal from './components/modals/AuthModal';
import { authService } from './services/authService';
import { itemService } from './services/itemService';
import vrmLogo from './assets/VRM.png';

Modal.setAppElement('#root');

function App() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState({ type: null });
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [items, setItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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

    // Проверка аутентификации
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(user));
    }

    // Загрузка товаров
    loadItems();

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const loadItems = async () => {
    try {
      const response = await itemService.getAll();
      setItems(response.data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.nazvanie.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id_item !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + parseFloat(item.price), 0).toFixed(2);
  };

  const openModal = (type) => {
    setModalIsOpen({ type });
  };

  const closeModal = () => {
    setModalIsOpen({ type: null });
    setLoginModalIsOpen(false);
    setRegisterModalIsOpen(false);
    setLoginErrors({});
    setRegisterErrors({});
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    let strength = 0;
    if (value.length >= 8) strength += 25;
    if (/[A-Z]/.test(value)) strength += 25;
    if (/[0-9]/.test(value)) strength += 25;
    if (/[^A-Za-z0-9]/.test(value)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleSteamLogin = () => {
    alert('Логин через Steam (заглушка: реализуйте API Steam)');
    closeModal();
  };

  const handleGoogleLogin = () => {
    alert('Логин через Google (заглушка: реализуйте API Google)');
    closeModal();
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const errors = {};
    
    if (!email.trim()) errors.email = "Пожалуйста, введите email";
    if (!password.trim()) errors.password = "Пожалуйста, введите пароль";
    
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }
    
    try {
      const response = await authService.login({ login: email, password });
      const { token, user } = response.data;
      handleLogin(user, token);
      closeModal();
    } catch (error) {
      setLoginErrors({ general: 'Ошибка входа: проверьте данные' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const acceptTerms = e.target.acceptTerms.checked;
    const errors = {};
    
    if (!username.trim() || username.length < 3 || username.length > 20) {
      errors.username = "Имя пользователя должно содержать от 3 до 20 символов";
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Пожалуйста, введите корректный email";
    }
    
    if (password.length < 8) {
      errors.password = "Пароль должен содержать минимум 8 символов";
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }
    
    if (!acceptTerms) {
      errors.terms = "Необходимо принять условия использования";
    }
    
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    
    try {
      const response = await authService.register({
        login: username,
        password,
        link: email
      });
      const { token, user } = response.data;
      handleLogin(user, token);
      closeModal();
    } catch (error) {
      setRegisterErrors({ general: 'Ошибка регистрации' });
    }
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
        cart={cart}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />
      
      <Routes>
        <Route path="/" element={
          <HomePage 
            filteredItems={filteredItems}
            addToCart={addToCart}
            handleSearchChange={handleSearchChange}
            searchQuery={searchQuery}
            openModal={openModal}
          />
        } />
        <Route path="/shop" element={
          <ShopPage 
            items={items} 
            addToCart={addToCart} 
          />
        } />
        <Route path="/item/:id" element={
          <ItemDetailPage 
            items={items} 
            addToCart={addToCart} 
          />
        } />
        <Route path="/help" element={
          <HelpPage 
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getTotalPrice={getTotalPrice}
            openModal={openModal}
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
      
      <AuthModal 
        loginModalIsOpen={loginModalIsOpen}
        registerModalIsOpen={registerModalIsOpen}
        onRequestClose={closeModal}
        handlePasswordChange={handlePasswordChange}
        passwordStrength={passwordStrength}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        loginErrors={loginErrors}
        registerErrors={registerErrors}
        handleSteamLogin={handleSteamLogin}
        handleGoogleLogin={handleGoogleLogin}
        handleEmailLogin={handleEmailLogin}
        handleRegister={handleRegister}
        setLoginModalIsOpen={setLoginModalIsOpen}
        setRegisterModalIsOpen={setRegisterModalIsOpen}
      />
    </div>
  );
}

export default App;