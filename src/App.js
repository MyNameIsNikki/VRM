import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSellDiscounts, setShowSellDiscounts] = useState(false);
  const [showBuyDiscounts, setShowBuyDiscounts] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);
  const [showReliability, setShowReliability] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showProfits, setShowProfits] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [userItems, setUserItems] = useState([]); // Предметы пользователя
  const [editingProfile, setEditingProfile] = useState(false);

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
    if (!username || !password) {
      setLoginMessage('Пожалуйста, заполните все поля.');
      return;
    }
    if (password.length < 6) {
      setLoginMessage('Пароль должен содержать минимум 6 символов.');
      return;
    }
    if (username === 'user' && password === 'pass123') {
      setIsLoggedIn(true);
      setLoginMessage('Успешный вход!');
      setShowLogin(false);
      // Пример предметов пользователя после входа
      setUserItems([
        { id: 1, name: 'Dragonclaw Hook', price: 500, image: '' },
        { id: 2, name: 'Arcana Blades', price: 300, image: '' },
      ]);
    } else {
      setLoginMessage('Неверное имя пользователя или пароль.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginMessage('');
    setUsername('');
    setPassword('');
    setUserItems([]);
    resetAllViews();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setRegisterMessage('Заполните все поля.');
      return;
    }
    if (password.length < 6) {
      setRegisterMessage('Пароль должен содержать минимум 6 символов.');
      return;
    }
    setRegisterMessage('Регистрация успешна! Вы можете войти.');
    setShowRegister(false);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (!username || !email) {
      setProfileMessage('Заполните все поля.');
      return;
    }
    setProfileMessage('Профиль успешно обновлён!');
    setEditingProfile(false);
  };

  const resetAllViews = () => {
    setShowFAQ(false);
    setShowCart(false);
    setShowSellDiscounts(false);
    setShowBuyDiscounts(false);
    setShowBenefits(false);
    setShowReliability(false);
    setShowSafety(false);
    setShowProfits(false);
  };

  const showSection = (section) => {
    resetAllViews();
    switch (section) {
      case 'faq':
        setShowFAQ(true);
        break;
      case 'cart':
        setShowCart(true);
        break;
      case 'sellDiscounts':
        setShowSellDiscounts(true);
        break;
      case 'buyDiscounts':
        setShowBuyDiscounts(true);
        break;
      case 'benefits':
        setShowBenefits(true);
        break;
      case 'reliability':
        setShowReliability(true);
        break;
      case 'safety':
        setShowSafety(true);
        break;
      case 'profits':
        setShowProfits(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <i className="fas fa-shield-alt"></i>
          <span onClick={() => resetAllViews()} style={{ cursor: 'pointer' }}>
            Dota Marketplace
          </span>
        </div>
        <nav className="nav">
          <button onClick={() => showSection('sellDiscounts')} className="nav-link">
            <i className="fas fa-tags"></i> Продать скины
          </button>
          <button onClick={() => showSection('buyDiscounts')} className="nav-link">
            <i className="fas fa-shopping-bag"></i> Купить скины
          </button>
          <button onClick={() => showSection('faq')} className="nav-link">
            <i className="fas fa-question-circle"></i> FAQ
          </button>
          <button onClick={() => showSection('cart')} className="nav-link">
            <i className="fas fa-shopping-cart"></i> Корзина
          </button>
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
            <h2>Вход в аккаунт</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Войти</button>
              <button type="button" onClick={() => setShowLogin(false)}>Закрыть</button>
            </form>
            {loginMessage && <p className={loginMessage.includes('Успешный') ? 'success' : 'error'}>{loginMessage}</p>}
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
                placeholder="Имя пользователя"
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
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Зарегистрироваться</button>
              <button type="button" onClick={() => setShowRegister(false)}>Закрыть</button>
            </form>
            {registerMessage && <p className={registerMessage.includes('успешна') ? 'success' : 'error'}>{registerMessage}</p>}
          </div>
        </div>
      )}

      <main className="main">
        {isLoggedIn && !showFAQ && !showCart && !showSellDiscounts && !showBuyDiscounts && !showBenefits && !showReliability && !showSafety && !showProfits ? (
          <section className="profile">
            <h1>Профиль пользователя</h1>
            <div className="profile-info">
              <h2>Добро пожаловать, {username}!</h2>
              <p>Email: {email || 'user@example.com'}</p>
              {editingProfile ? (
                <form onSubmit={handleProfileUpdate} className="edit-profile-form">
                  <input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit">Сохранить</button>
                  <button type="button" onClick={() => setEditingProfile(false)}>Отмена</button>
                </form>
              ) : (
                <button onClick={() => setEditingProfile(true)} className="edit-profile-button">
                  Редактировать профиль
                </button>
              )}
              {profileMessage && <p className={profileMessage.includes('успешно') ? 'success' : 'error'}>{profileMessage}</p>}
            </div>
            <div className="user-items">
              <h2>Ваши предметы</h2>
              {userItems.length > 0 ? (
                <div className="items-list">
                  {userItems.map((item) => (
                    <article key={item.id} className="item-card">
                      {item.image && <img src={item.image} alt={item.name} className="item-image" />}
                      <h3>{item.name}</h3>
                      <p className="price">{item.price} P</p>
                    </article>
                  ))}
                </div>
              ) : (
                <p>У вас пока нет предметов для продажи.</p>
              )}
            </div>
            <aside className="sidebar">
              <button onClick={() => showSection('benefits')} className="nav-link"><i className="fas fa-chevron-down"></i> ЧТО ВЫ ПОЛУЧАЕТЕ?</button>
              <button onClick={() => showSection('reliability')} className="nav-link"><i className="fas fa-thumbs-up"></i> НАДЁЖНОСТЬ</button>
              <button onClick={() => showSection('safety')} className="nav-link"><i className="fas fa-lock"></i> БЕЗОПАСНОСТЬ</button>
              <button onClick={() => showSection('profits')} className="nav-link"><i className="fas fa-dollar-sign"></i> ВЫГОДЫ</button>
            </aside>
          </section>
        ) : showFAQ ? (
          <>
            <section className="faq">
              <h1>Часто задаваемые вопросы (FAQ)</h1>
              <div className="faq-item">
                <h3>1. Что такое Virtual Russian Market?</h3>
                <p>VRM — это платформа для покупки и продажи вещей из игры Dota 2. Здесь вы можете найти редкие предметы, обменять их или продать свои собственные.</p>
              </div>
              <div className="faq-item">
                <h3>2. Как зарегистрироваться на платформе?</h3>
                <p>Нажмите на кнопку "Регистрация" в правом верхнем углу, заполните форму (имя пользователя, email, пароль) и подтвердите регистрацию. После этого вы сможете войти в систему.</p>
              </div>
              <div className="faq-item">
                <h3>3. Безопасно ли покупать вещи на Virtual Russian Market?</h3>
                <p>Да, мы используем современные технологии шифрования и проверяем всех продавцов, чтобы обеспечить безопасность сделок. Однако рекомендуем проверять отзывы о продавце перед покупкой.</p>
              </div>
              <div className="faq-item">
                <h3>4. Как продать свои предметы?</h3>
                <p>После регистрации перейдите в раздел "Продать скидки", добавьте предмет, укажите цену и описание. Ваш предмет будет доступен для покупки после модерации.</p>
              </div>
              <div className="faq-item">
                <h3>5. Какие способы оплаты доступны?</h3>
                <p>Мы принимаем оплату через банковские карты, электронные кошельки (например, Яндекс Деньги). Выберите удобный способ при оформлении покупки.</p>
              </div>
              <div className="faq-item">
                <h3>6. Что делать, если возникли проблемы с покупкой?</h3>
                <p>Свяжитесь с нашей службой поддержки через форму в разделе "Контакты". Мы рассмотрим ваш запрос в течение 24 часов.</p>
              </div>
            </section>
            <aside className="sidebar">
              <button onClick={() => showSection('benefits')} className="nav-link"><i className="fas fa-chevron-down"></i> ЧТО ВЫ ПОЛУЧАЕТЕ?</button>
              <button onClick={() => showSection('reliability')} className="nav-link"><i className="fas fa-thumbs-up"></i> НАДЁЖНОСТЬ</button>
              <button onClick={() => showSection('safety')} className="nav-link"><i className="fas fa-lock"></i> БЕЗОПАСНОСТЬ</button>
              <button onClick={() => showSection('profits')} className="nav-link"><i className="fas fa-dollar-sign"></i> ВЫГОДЫ</button>
            </aside>
          </>
        ) : showCart ? (
          <>
            <section className="cart">
              <h1>Ваша Корзина</h1>
              {cart.length > 0 ? (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        {item.image && <img src={item.image} alt={item.name} className="cart-item-image" />}
                        <div className="cart-item-details">
                          <h3>{item.name}</h3>
                          <p className="price">{item.price} P</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="remove-from-cart">
                          <i className="fas fa-trash"></i> Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="cart-total">
                    <h3>Итого: {getTotalPrice()} P</h3>
                    <button className="checkout-button">Оформить заказ</button>
                  </div>
                </>
              ) : (
                <p className="empty-cart">Ваша корзина пуста.</p>
              )}
            </section>
            <aside className="sidebar">
              <button onClick={() => showSection('benefits')} className="nav-link"><i className="fas fa-chevron-down"></i> ЧТО ВЫ ПОЛУЧАЕТЕ?</button>
              <button onClick={() => showSection('reliability')} className="nav-link"><i className="fas fa-thumbs-up"></i> НАДЁЖНОСТЬ</button>
              <button onClick={() => showSection('safety')} className="nav-link"><i className="fas fa-lock"></i> БЕЗОПАСНОСТЬ</button>
              <button onClick={() => showSection('profits')} className="nav-link"><i className="fas fa-dollar-sign"></i> ВЫГОДЫ</button>
            </aside>
          </>
        ) : showSellDiscounts ? (
          <>
            <section className="sell-discounts">
              <h1>Продать скидки</h1>
              <p>Здесь вы можете выставить свои предметы на продажу. Заполните форму ниже, чтобы добавить новый предмет.</p>
              <form className="sell-form">
                <input type="text" placeholder="Название предмета" />
                <input type="number" placeholder="Цена (P)" />
                <textarea placeholder="Описание предмета"></textarea>
                <button type="submit">Добавить предмет</button>
              </form>
            </section>
            <aside className="sidebar">
              <button onClick={() => showSection('benefits')} className="nav-link"><i className="fas fa-chevron-down"></i> ЧТО ВЫ ПОЛУЧАЕТЕ?</button>
              <button onClick={() => showSection('reliability')} className="nav-link"><i className="fas fa-thumbs-up"></i> НАДЁЖНОСТЬ</button>
              <button onClick={() => showSection('safety')} className="nav-link"><i className="fas fa-lock"></i> БЕЗОПАСНОСТЬ</button>
              <button onClick={() => showSection('profits')} className="nav-link"><i className="fas fa-dollar-sign"></i> ВЫГОДЫ</button>
            </aside>
          </>
        ) : showBuyDiscounts ? (
          <>
            <section className="buy-discounts">
              <h1>Купить скидки</h1>
              <p>Ознакомьтесь с доступными скидками на предметы Dota 2. Вы можете приобрести их прямо сейчас!</p>
              <div className="discount-items">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <article key={item.id} className="discount-item">
                      {item.image && <img src={item.image} alt={item.name} className="discount-item-image" />}
                      <h3>{item.name}</h3>
                      <p className="price">{item.price} P</p>
                      <button onClick={() => addToCart(item)} className="add-to-cart">
                        <i className="fas fa-shopping-cart"></i> В КОРЗИНУ
                      </button>
                    </article>
                  ))
                ) : (
                  <p className="no-items">Скидки не найдены.</p>
                )}
              </div>
            </section>
            <aside className="sidebar">
              <button onClick={() => showSection('benefits')} className="nav-link"><i className="fas fa-chevron-down"></i> ЧТО ВЫ ПОЛУЧАЕТЕ?</button>
              <button onClick={() => showSection('reliability')} className="nav-link"><i className="fas fa-thumbs-up"></i> НАДЁЖНОСТЬ</button>
              <button onClick={() => showSection('safety')} className="nav-link"><i className="fas fa-lock"></i> БЕЗОПАСНОСТЬ</button>
              <button onClick={() => showSection('profits')} className="nav-link"><i className="fas fa-dollar-sign"></i> ВЫГОДЫ</button>
            </aside>
          </>
        ) : showBenefits ? (
          <section className="benefits">
            <h1>ЧТО ВЫ ПОЛУЧАЕТЕ?</h1>
            <p>Используя Dota Marketplace, вы получаете доступ к широкому ассортименту предметов Dota 2, удобной системе продажи и покупки, а также поддержке нашей команды.</p>
            <ul>
              <li>Доступ к редким предметам</li>
              <li>Быстрая и безопасная торговля</li>
              <li>Поддержка 24/7</li>
              <li>Прозрачные комиссии</li>
            </ul>
          </section>
        ) : showReliability ? (
          <section className="reliability">
            <h1>НАДЁЖНОСТЬ</h1>
            <p>Мы проверяем всех продавцов и следим за качеством сделок, чтобы вы могли торговать с уверенностью.</p>
            <p>Наши пользователи оставили более 10,000 положительных отзывов о нашей платформе.</p>
          </section>
        ) : showSafety ? (
          <section className="safety">
            <h1>БЕЗОПАСНОСТЬ</h1>
            <p>Мы используем шифрование данных и двухфакторную аутентификацию для защиты ваших транзакций и личной информации.</p>
            <p>Все сделки проходят через защищённый escrow-сервис.</p>
          </section>
        ) : showProfits ? (
          <section className="profits">
            <h1>ВЫГОДЫ</h1>
            <p>Продавайте свои предметы по выгодным ценам и покупайте со скидками до 50%!</p>
            <p>Участвуйте в акциях и получайте бонусы за активность на платформе.</p>
          </section>
        ) : (
          <>
            <section className="hero">
              <h1>ПРОДАЖА И ПОКУПКА ВЕЩЕЙ ИЗ DOTA 2</h1>
            </section>

            <aside className="sidebar">
              <button onClick={() => showSection('benefits')} className="nav-link"><i className="fas fa-chevron-down"></i> ЧТО ВЫ ПОЛУЧАЕТЕ?</button>
              <button onClick={() => showSection('reliability')} className="nav-link"><i className="fas fa-thumbs-up"></i> НАДЁЖНОСТЬ</button>
              <button onClick={() => showSection('safety')} className="nav-link"><i className="fas fa-lock"></i> БЕЗОПАСНОСТЬ</button>
              <button onClick={() => showSection('profits')} className="nav-link"><i className="fas fa-dollar-sign"></i> ВЫГОДЫ</button>
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
                    <button onClick={() => addToCart(item)} className="add-to-cart">
                      <i className="fas fa-shopping-cart"></i> В КОРЗИНУ
                    </button>
                  </article>
                ))
              ) : (
                <p className="no-items">Товары не найдены.</p>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Dota Marketplace. Все права защищены.</p>
      </footer>
    </div>
  );
}

export default App;