//https://github.com/xJleSx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../modals/AuthModal';
import RegisterModal from '../modals/RegisterModal';
import TestRulesModal from '../modals/TestRulesModal'; // Добавьте этот импорт
import './Header.css';

const Header = ({ openModal, setCartModalIsOpen, cart, isLoggedIn, onLogout, onLogin }) => {
  const navigate = useNavigate();
  const [activeAuthModal, setActiveAuthModal] = useState(null);
  const [testModalIsOpen, setTestModalIsOpen] = useState(false); // Добавьте это состояние

  console.log('Header: isLoggedIn=', isLoggedIn);

  const handleLoginSuccess = (token) => {
    console.log('Header: handleLoginSuccess, token=', token);
    setActiveAuthModal(null);
    onLogin(token);
  };

  const handleRegisterSuccess = (token) => {
    console.log('Header: handleRegisterSuccess, token=', token);
    setActiveAuthModal(null);
    onLogin(token);
  };

  const handleLogoutClick = () => {
    console.log('Header: handleLogoutClick called');
    onLogout();
    navigate('/');
  };

  const handleSellClick = () => {
    // Вместо открытия модального окна продажи открываем тест
    setTestModalIsOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate('/')}>
            VRM
          </div>
          <div className="nav-links">
            {isLoggedIn ? (
              <>
                <button className="nav-link-button" onClick={handleSellClick}> {/* Обновите этот обработчик */}
                  <i className="fas fa-coins"></i> Продать скины
                </button>
                <button className="nav-link-button" onClick={() => navigate('/shop')}>
                  <i className="fas fa-shopping-cart"></i> Купить скины
                </button>
                <button className="nav-link-button" onClick={() => navigate('/help')}>
                  <i className="fas fa-question-circle"></i> Помощь
                </button>
                <button className="nav-link-button" onClick={() => setCartModalIsOpen(true)}>
                  <i className="fas fa-shopping-basket"></i> Корзина
                  {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                </button>
                <button className="nav-link-button" onClick={handleLogoutClick}>
                  <i className="fas fa-sign-out-alt"></i> Выход
                </button>
              </>
            ) : (
              <>
                <button className="nav-link-button" onClick={() => setActiveAuthModal('login')}>
                  <i className="fas fa-sign-in-alt"></i> Вход
                </button>
                <button className="nav-link-button" onClick={() => setActiveAuthModal('register')}>
                  <i className="fas fa-user-plus"></i> Регистрация
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={activeAuthModal === 'login'}
        onClose={() => setActiveAuthModal(null)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setActiveAuthModal('register')}
      />
      
      <RegisterModal
        isOpen={activeAuthModal === 'register'}
        onClose={() => setActiveAuthModal(null)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => setActiveAuthModal('login')}
      />

      <TestRulesModal 
        isOpen={testModalIsOpen}
        onRequestClose={() => setTestModalIsOpen(false)}
      />
    </>
  );
};

export default Header;