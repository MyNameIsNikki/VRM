import React, { useState, useEffect } from 'react';
import './RegisterModal.css';
import SecurityPolicyModal from './SecurityPolicyModal'; 
import { hashPassword, isValidEmail, isStrongPassword, sanitizeInput } from '../utils/security';

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
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

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
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const sanitizedUsername = sanitizeInput(formData.username.trim());
    const sanitizedEmail = sanitizeInput(formData.email.trim());
    
    if (!sanitizedUsername) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (sanitizedUsername.length < 3) {
      newErrors.username = 'Имя пользователя должно содержать не менее 3 символов';
    }
    
    if (!sanitizedEmail) {
      newErrors.email = 'Email обязателен';
    } else if (!isValidEmail(sanitizedEmail)) {
      newErrors.email = 'Некорректный формат email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (!isStrongPassword(formData.password)) {
      newErrors.password = 'Пароль должен содержать не менее 8 символов, включая буквы и цифры';
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
      
      // В реальном приложении здесь мы бы отправили хешированный пароль на сервер
      const hashedPassword = await hashPassword(formData.password);
      
      console.log('Регистрация:', {
        username: sanitizeInput(formData.username.trim()),
        email: sanitizeInput(formData.email.trim()),
        password: hashedPassword // Отправляем хеш вместо plain text
      });
      
      // Генерируем простой токен (в реальном приложении это должен быть JWT от сервера)
      const token = 'demo-auth-token-' + Math.random().toString(36).substr(2);
      
      if (onRegisterSuccess) {
        onRegisterSuccess(token);
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

  const handleSecurityPolicyClick = (e) => {
    e.preventDefault();
    setIsSecurityModalOpen(true);
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
  id="confirm-password"
  name="confirmPassword"
  type="password"
  placeholder="Повторите ваш пароль"
  value={formData.confirmPassword}
  onChange={handleInputChange}
  autoComplete="new-password"
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
              Я принимаю условия использования и согласен с{' '}
              <a href="#" className="link" onClick={handleSecurityPolicyClick}>
                политикой конфиденциальности
              </a>
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

      {/* Добавляем модальное окно политики безопасности */}
      <SecurityPolicyModal 
        isOpen={isSecurityModalOpen}
        onRequestClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

export default RegisterModal; 