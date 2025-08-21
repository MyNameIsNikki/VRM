// src/components/modals/RegisterModal.jsx

import React, { useState, useEffect } from 'react';
import './RegisterModal.css';

const RegisterModal = ({ isOpen, onClose, onRegisterSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Обработка нажатия клавиши Escape для закрытия модального окна
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку для этого поля при изменении
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль должен содержать не менее 8 символов';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'Необходимо принять условия использования';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Эмуляция запроса на сервер
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // В реальном приложении здесь был бы запрос к API
      console.log('Регистрация:', formData);
      
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
      
      onClose();
    } catch (err) {
      setErrors({ submit: 'Произошла ошибка при регистрации. Попробуйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    onClose();
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="register-modal-overlay" onClick={handleOverlayClick}>
      <div className="register-modal">
        <button 
          className="auth-modal-close" 
          onClick={onClose}
          aria-label="Закрыть модальное окно"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '20px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h1 className="title">Создать аккаунт</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Имя пользователя <span>*</span></label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Придумайте уникальное имя"
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="username"
              disabled={isLoading}
            />
            {errors.username && <div className="error">{errors.username}</div>}
            <div className="hint"></div>
          </div>

          <div className="field">
            <label htmlFor="email">Email <span>*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              disabled={isLoading}
            />
            {errors.email && <div className="error">{errors.email}</div>}
            <div className="hint"></div>
          </div>

          <div className="field">
            <label htmlFor="password">Пароль <span>*</span></label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Придумайте надежный пароль"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.password && <div className="error">{errors.password}</div>}
            <div className="hint">Пароль должен содержать не менее 8 символов, включая цифры и буквы</div>
          </div>

          <div className="field">
            <label htmlFor="confirm-password">Подтверждение пароля <span>*</span></label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Повторите ваш пароль"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
              disabled={isLoading}
            />
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
            <div className="hint"></div>
          </div>

          <div className="checkbox">
            <input
              id="terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="terms">
              Я принимаю условия использования и согласен с политикой конфиденциальности
            </label>
          </div>
          {errors.terms && <div className="error" style={{marginTop: '-10px', marginBottom: '10px'}}>{errors.terms}</div>}

          <button 
            type="submit" 
            className="btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          {errors.submit && <div className="error">{errors.submit}</div>}
        </form>

        <div className="bottom-note">
          Уже есть аккаунт?{' '}
          <a href="./HomePage.jsx" className="link" onClick={handleLoginClick}>
            Войти
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;