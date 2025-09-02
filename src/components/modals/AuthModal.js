import React, { useState, useEffect } from 'react';
import './AuthModal.css';
import { sanitizeInput } from '../utils/security';

const AuthModal = ({ isOpen, onClose, onLoginSuccess, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('login_username');
    const savedRemember = localStorage.getItem('login_remember');
    
    if (savedUsername && savedRemember === 'true') {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Санитизация ввода
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    // Простая валидация
    if (!sanitizedUsername || !sanitizedPassword) {
      setError('Введите имя пользователя и пароль.');
      setIsLoading(false);
      return;
    }

    try {
      // Эмуляция запроса на сервер
      await new Promise(resolve => setTimeout(resolve, 900));
      
      // Фиктивная авторизация: username 'user' password '1234'
      if (sanitizedUsername === 'user' && sanitizedPassword === '1234') {
        if (rememberMe) {
          localStorage.setItem('login_username', sanitizedUsername);
          localStorage.setItem('login_remember', 'true');
        } else {
          localStorage.removeItem('login_username');
          localStorage.setItem('login_remember', 'false');
        }
        
        // Генерируем простой токен (в реальном приложении это должен быть JWT от сервера)
        const token = 'demo-auth-token-' + Math.random().toString(36).substr(2);
        
        if (onLoginSuccess) {
          onLoginSuccess(token);
        }
        
        onClose();
      } else {
        setError('Неверное имя пользователя или пароль.');
      }
    } catch (err) {
      setError('Произошла ошибка при входе. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider) => {
    alert(`Вход через ${provider} (демо)`);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Функция восстановления пароля (демо).');
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    onClose();
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
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

        <h1 className="title">Вход</h1>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <input
              type="text"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={isLoading}
            />
            <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 20a8 8 0 0 1 16 0" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </label>

          <label className="field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="icon"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {showPassword ? (
                  <>
                    <path d="M3 12s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="rgba(255,255,255,0.9)" strokeWidth='1.4' strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="rgba(255,255,255,0.9)" strokeWidth='1.4' strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="rgba(255,255,255,0.9)" strokeWidth='1.4' strokeLinecap="round" strokeLinejoin="round"/>
                  </>
                )}
              </svg>
            </button>
          </label>

          <div className="row">
            <div className="remember">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', cursor: 'pointer' }}>
                Запомнить меня
              </label>
            </div>
            <div>
              <a href="./HomePage" className="link" onClick={handleForgotPassword}>
                Забыли пароль?
              </a>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
          
          {error && <div className="error">{error}</div>}
        </form>

        <div className="divider">или войти через</div>

        <div className="social-login">
          <div 
            className="social-icon" 
            title="Войти через Steam"
            onClick={() => handleSocialLogin('Steam')}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.979 3.054c4.521 0 8.187 3.656 8.187 8.167 0 4.51-3.666 8.166-8.187 8.166-4.52 0-8.186-3.656-8.186-8.166 0-4.511 3.665-8.167 8.186-8.167zm2.347 5.781l-2.27 3.312-2.128-.962-.472.62 2.686 1.212 2.8-4.092-.616-.09zM8.28 12.358c-.735 0-1.332.592-1.332 1.322 0 .73.597 1.322 1.332 1.322.736 0 1.332-.592 1.332-1.322 0-.73-.596-1.322-1.332-1.322zm6.63 0c-.735 0-1.332.592-1.332 1.322 0 .73.597 1.322 1.332 1.322.736 0 1.332-.592 1.332-1.322 0-.73-.596-1.322-1.332-1.322z" fill="currentColor"/>
            </svg>
          </div>
          <div 
            className="social-icon" 
            title="Войти через Google"
            onClick={() => handleSocialLogin('Google')}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.545 10.239v3.821h5.445c-.227 1.482-1.03 2.984-2.166 3.894l3.679 2.823c2.153-1.948 3.393-4.818 3.393-8.247 0-.738-.066-1.448-.19-2.118H12.545z" fill="#4285F4"/>
              <path d="M6.26 14.598A6.981 6.981 0 0 1 5.545 12c0-.782.125-1.533.357-2.235v-.814H2.754A11.965 11.965 0 0 0 1.545 12c0 1.92.462 3.73 1.274 5.343l2.44-1.878.001-.867z" fill="#34A853"/>
              <path d="M12.545 5.457c1.67 0 3.158.572 4.334 1.69l3.239-3.229C18.064 2.09 15.545 1 12.545 1 8.495 1 4.99 3.24 2.754 6.951l3.148 2.422c.784-2.34 2.924-4.916 6.643-4.916z" fill="#EA4335"/>
              <path d="M1.545 12c0-2.04.504-3.955 1.392-5.637L2.754 6.95A11.934 11.934 0 0 0 1.545 12c0 1.92.462 3.73 1.274 5.343l3.148-2.422A6.932 6.932 0 0 1 5.545 12c0-.782.125-1.533.357-2.235L2.754 6.951z" fill="#FBBC05"/>
            </svg>
          </div>
        </div>

        <div className="bottom-note">
          Нет аккаунта?{' '}
          <a href="./HomePage" className="link" onClick={handleRegisterClick}>
            Зарегистрироваться
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;