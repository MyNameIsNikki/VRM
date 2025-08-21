import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../modals/AuthModal';
import RegisterModal from '../modals/RegisterModal';
import './Header.css';

const Header = ({ openModal, setCartModalIsOpen, cart }) => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    console.log('Пользователь успешно вошел');
  };

  const handleRegisterSuccess = () => {
    console.log('Пользователь успешно зарегистрирован');
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleSwitchToRegister = () => {
    setIsAuthModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate('/')}>
            VRM
          </div>
          <div className="nav-links">
            <button className="nav-link-button" onClick={() => openModal('sell')}>
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
            <button className="nav-link-button" onClick={() => setIsRegisterModalOpen(true)}>
              <i className="fas fa-user-plus"></i> Регистрация
            </button>
            <button className="nav-link-button" onClick={() => setIsAuthModalOpen(true)}>
              <i className="fas fa-sign-in-alt"></i> Вход
            </button>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Header;