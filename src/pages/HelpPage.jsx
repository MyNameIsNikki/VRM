import React, { useState } from 'react';
import Header from '../components/Header/Header';
import AuthModal from '../components/modals/AuthModal';
import InfoModal from '../components/modals/InfoModal';
import CartModal from '../components/modals/CartModal';
import RulesModal from '../components/modals/RulesModal';
import TermsModal from '../components/modals/TermsModal';
import SecurityPolicyModal from '../components/modals/SecurityPolicyModal';
import TradeRulesModal from '../components/modals/TradeRulesModal';
import './HelpPage.css';

const HelpPage = ({ 
  cart, 
  addToCart, 
  removeFromCart, 
  getTotalPrice, 
  openModal, 
  setCartModalIsOpen 
}) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    email: '',
    subject: '',
    message: ''
  });
  const [modalIsOpen, setModalIsOpen] = useState({ type: null });
  const [cartModalIsOpen, setCartModalIsOpenState] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
  const [rulesModalIsOpen, setRulesModalIsOpen] = useState(false);
  const [termsModalIsOpen, setTermsModalIsOpen] = useState(false);
  const [securityPolicyModalIsOpen, setSecurityPolicyModalIsOpen] = useState(false);
  const [tradeRulesModalIsOpen, setTradeRulesModalIsOpen] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactForm.email && contactForm.subject && contactForm.message) {
      alert('Ваш запрос успешно отправлен! Мы ответим вам в ближайшее время.');
      setContactForm({ email: '', subject: '', message: '' });
    } else {
      alert('Пожалуйста, заполните все поля формы.');
    }
  };

  const handleOpenModal = (type) => {
    setModalIsOpen({ type });
  };

  const handleCloseModal = () => {
    setModalIsOpen({ type: null });
    setCartModalIsOpenState(false);
    setLoginModalIsOpen(false);
    setRegisterModalIsOpen(false);
    setRulesModalIsOpen(false);
    setTermsModalIsOpen(false);
    setSecurityPolicyModalIsOpen(false);
    setTradeRulesModalIsOpen(false);
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
    handleCloseModal();
  };

  const handleGoogleLogin = () => {
    alert('Логин через Google (заглушка: реализуйте API Google)');
    handleCloseModal();
  };

  const handleEmailLogin = (e) => {
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
    
    alert(`Логин через Email: ${email} (заглушка: реализуйте бэкенд)`);
    handleCloseModal();
  };

  const handleRegister = (e) => {
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
    
    alert(`Регистрация: ${username}, Email: ${email} (заглушка: реализуйте бэкенд)`);
    handleCloseModal();
  };

  return (
    <div className="help-page">
      <Header 
        openModal={handleOpenModal}
        setCartModalIsOpen={setCartModalIsOpenState}
        cart={cart}
      />

      <div className="full-width title-block">
        ЦЕНТР ПОМОЩИ VRM
      </div>

      <div className="help-container">
        {/* Раздел FAQ */}
        <div className="help-section">
          <h2 className="help-title"><i className="fas fa-question-circle"></i> Часто задаваемые вопросы</h2>
          
          <div className={`faq-item ${activeFaq === 0 ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => handleFaqToggle(0)}>
              <i className={`fas fa-chevron-${activeFaq === 0 ? 'down' : 'right'}`}></i>
              Как купить предмет на VRM Marketplace?
            </div>
            {activeFaq === 0 && (
              <div className="faq-answer">
                <p>Для покупки предмета выполните следующие шаги:</p>
                <ol>
                  <li>Найдите нужный предмет через поиск или просматривая категории</li>
                  <li>Нажмите на кнопку "Купить сейчас" или "Добавить в корзину"</li>
                  <li>Если вы выбрали "Добавить в корзину", перейдите в корзину для оформления заказа</li>
                  <li>Выберите удобный способ оплаты и завершите транзакцию</li>
                  <li>После подтверждения оплаты предмет будет передан вам в игру автоматически</li>
                </ol>
              </div>
            )}
          </div>
          
          <div className={`faq-item ${activeFaq === 1 ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => handleFaqToggle(1)}>
              <i className={`fas fa-chevron-${activeFaq === 1 ? 'down' : 'right'}`}></i>
              Как продать предмет через VRM Marketplace?
            </div>
            {activeFaq === 1 && (
              <div className="faq-answer">
                <p>Процесс продажи предметов прост:</p>
                <ol>
                  <li>Авторизуйтесь через Steam на нашем сайте</li>
                  <li>Перейдите в раздел "Продать скины"</li>
                  <li>Выберите предметы из вашего инвентаря Dota 2, которые хотите продать</li>
                  <li>Установите цену для каждого предметы или примите нашу автоматическую оценку</li>
                  <li>Подтвердите передачу предметов через Steam Guard</li>
                  <li>После продажи предмета средства будут зачислены на ваш баланс в VRM</li>
                </ol>
              </div>
            )}
          </div>

          <div className={`faq-item ${activeFaq === 2 ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => handleFaqToggle(2)}>
              <i className={`fas fa-chevron-${activeFaq === 2 ? 'down' : 'right'}`}></i>
              Сколько времени занимает передача предмета?
            </div>
            {activeFaq === 2 && (
              <div className="faq-answer">
                <p>В большинстве случаев передача предмета происходит мгновенно после подтверждения оплаты. Однако в некоторых случаях это может занять до 15 минут из-за особенностей работы Steam API.</p>
                <p>Если предмет не появился в вашем инвентаре в течение часа, пожалуйста, свяжитесь с нашей службой поддержки.</p>
              </div>
            )}
          </div>
          
          <div className={`faq-item ${activeFaq === 3 ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => handleFaqToggle(3)}>
              <i className={`fas fa-chevron-${activeFaq === 3 ? 'down' : 'right'}`}></i>
              Безопасно ли совершать покупки на VRM?
            </div>
            {activeFaq === 3 && (
              <div className="faq-answer">
                <p>Да, VRM Marketplace обеспечивает полную безопасность всех транзакций:</p>
                <ul>
                  <li>Используем защищённое HTTPS-соединение</li>
                  <li>Не храним данные ваших платежных карт</li>
                  <li>Все операции подтверждаются через Steam Guard</li>
                  <li>Система защиты от мошенничества 24/7</li>
                  <li>Гарантия возврата средств в случае проблем</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className={`faq-item ${activeFaq === 4 ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => handleFaqToggle(4)}>
              <i className={`fas fa-chevron-${activeFaq === 4 ? 'down' : 'right'}`}></i>
              Какие способы оплаты доступны?
            </div>
            {activeFaq === 4 && (
              <div className="faq-answer">
                <p>Мы поддерживаем все популярные способы оплаты:</p>
                <div className="payment-methods">
                  <div className="payment-method">
                    <i className="fab fa-cc-visa"></i>
                    <span>Visa</span>
                  </div>
                  <div className="payment-method">
                    <i className="fab fa-cc-mastercard"></i>
                    <span>Mastercard</span>
                  </div>
                  <div className="payment-method">
                    <i className="fab fa-paypal"></i>
                    <span>PayPal</span>
                  </div>
                  <div className="payment-method">
                    <i className="fab fa-qiwi"></i>
                    <span>QIWI</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className={`faq-item ${activeFaq === 5 ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => handleFaqToggle(5)}>
              <i className={`fas fa-chevron-${activeFaq === 5 ? 'down' : 'right'}`}></i>
              Где можно ознакомиться с правилами использования VRM Marketplace?
            </div>
            {activeFaq === 5 && (
              <div className="faq-answer">
                <p>Полные правила использования нашей платформы доступны в специальном разделе. Вы можете ознакомиться с ними, нажав на ссылку ниже:</p>
                <button 
                  className="rules-link-btn"
                  onClick={() => setRulesModalIsOpen(true)}
                >
                  <i className="fas fa-file-alt"></i> Открыть правила использования
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Раздел контактов */}
        <div className="help-section">
          <h2 className="help-title"><i className="fas fa-headset"></i> Служба поддержки</h2>
          <p>Если вы не нашли ответ на свой вопрос в разделе FAQ, наша служба поддержки готова помочь вам.</p>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-email">Ваш email</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                className="form-control"
                placeholder="example@mail.com"
                value={contactForm.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-subject">Тема обращения</label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                className="form-control"
                placeholder="Опишите кратко суть проблемы"
                value={contactForm.subject}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-message">Сообщение</label>
              <textarea
                id="contact-message"
                name="message"
                className="form-control"
                placeholder="Подробно опишите вашу проблему или вопрос"
                value={contactForm.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">
              <i className="fas fa-paper-plane"></i> Отправить запрос
            </button>
          </form>
          
          <div style={{marginTop: '30px'}}>
            <h3 style={{color: '#ffffff', marginBottom: '15px'}}>Другие способы связи:</h3>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '20px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <i className="fab fa-telegram" style={{color: '#0088cc', fontSize: '24px'}}></i>
                <span>@VRM_Support_Bot</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <i className="fas fa-envelope" style={{color: '#ffffff', fontSize: '24px'}}></i>
                <span>support@vrm-market.com</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <i className="fab fa-discord" style={{color: '#7289da', fontSize: '24px'}}></i>
                <span>VRM Support#1234</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Раздел полезных ссылок */}
        <div className="help-section">
          <h2 className="help-title"><i className="fas fa-link"></i> Полезные ссылки</h2>
          <p>Воспользуйтесь этими ресурсами для получения дополнительной информации:</p>
          
          <div className="useful-links">
            <div className="link-card">
              <h3><i className="fas fa-book"></i> Документация</h3>
              <ul>
                <li>
                  <button 
                    className="link-button"
                    onClick={() => setRulesModalIsOpen(true)}
                  >
                    <i className="fas fa-file-alt"></i> Правила использования
                  </button>
                </li>
                <li>
                  <button 
                    className="link-button"
                    onClick={() => setTermsModalIsOpen(true)}
                  >
                    <i className="fas fa-file-contract"></i> Пользовательское соглашение
                  </button>
                </li>
                <li>
                  <button 
                    className="link-button"
                    onClick={() => setSecurityPolicyModalIsOpen(true)}
                  >
                    <i className="fas fa-shield-alt"></i> Политика безопасности
                  </button>
                </li>
                <li>
                  <button 
                    className="link-button"
                    onClick={() => setTradeRulesModalIsOpen(true)}
                  >
                    <i className="fas fa-exchange-alt"></i> Правила торговли
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="link-card">
              <h3><i className="fas fa-users"></i> Сообщество</h3>
              <ul>
                <li><a href="./HelpPage.jsx"><i className="fab fa-steam"></i> Группа Steam</a></li>
                <li><a href="./HelpPage.jsx"><i className="fab fa-discord"></i> Discord сервер</a></li>
                <li><a href="./HelpPage.jsx"><i className="fab fa-reddit"></i> Reddit сообщество</a></li>
                <li><a href="./HelpPage.jsx"><i className="fab fa-twitter"></i> Twitter</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>


      <InfoModal 
        isOpen={modalIsOpen.type !== null} 
        onRequestClose={handleCloseModal}
        type={modalIsOpen.type}
      />
      
      <CartModal 
        isOpen={cartModalIsOpen}
        onRequestClose={handleCloseModal}
        cart={cart}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
      />
      
      <AuthModal 
        loginModalIsOpen={loginModalIsOpen}
        registerModalIsOpen={registerModalIsOpen}
        onRequestClose={handleCloseModal}
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

      <RulesModal 
        isOpen={rulesModalIsOpen}
        onRequestClose={() => setRulesModalIsOpen(false)}
      />
      
      <TermsModal 
        isOpen={termsModalIsOpen}
        onRequestClose={() => setTermsModalIsOpen(false)}
      />
      
      <SecurityPolicyModal 
        isOpen={securityPolicyModalIsOpen}
        onRequestClose={() => setSecurityPolicyModalIsOpen(false)}
      />
      
      <TradeRulesModal 
        isOpen={tradeRulesModalIsOpen}
        onRequestClose={() => setTradeRulesModalIsOpen(false)}
      />
    </div>
  );
};

export default HelpPage;