import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import vrmLogo from './assets/VRM.png';
import dragonclawHook from './assets/Dragonclaw Hook.png';
import avowance from './assets/Avowance.png';
import exaltedFeast from './assets/Exalted Feast of Abscession - Back.png';

Modal.setAppElement('#root');

const items = [
  {
    id: 1,
    name: 'Dragonclaw Hook',
    price: 18083.58,
    steamPrice: 19937.70,
    hero: 'Pudge',
    slot: 'Оружие',
    type: 'Украшение',
    rarity: 'Immortal',
    quality: 'Standard',
    image: dragonclawHook,
    subtitle: 'Коготь с левой лапы черного дракона. Единственная часть монстра, выжившая после встречи с ненасытным голодом Pudge.',
    stock: 3,
    seller: 'JleS',
  },
  {
    id: 2,
    name: 'Arcana of the Crimson Witness',
    price: 27153.66,
    steamPrice: 28124.80,
    hero: 'Phantom Assassin',
    slot: 'Плечик',
    type: 'Украшение',
    rarity: 'Immortal',
    quality: 'Standard',
    image: avowance,
    subtitle: 'Новая версия Crimson Witness',
    stock: 8,
    seller: 'kr1po4ek',
  },
  {
    id: 3,
    name: 'Exalted Feast of Abscession - Back',
    price: 39.72,
    steamPrice: 59.59,
    hero: 'Pudge',
    slot: 'Спина',
    type: 'Украшение',
    rarity: 'Immortal',
    quality: 'Exalted',
    image: exaltedFeast,
    subtitle: 'Коготь с левой лапы черного дракона. Единственная часть монстра, выжившая после встречи с ненасытным голодом Pudge.',
    stock: 2,
    seller: 'kr1po4ek',
  },
];

function App() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState({ type: null });
  const [cartModalIsOpen, setCartModalIsOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    const showTime = () => {
      const timeElement = document.getElementById('currentTime');
      if (timeElement) {
        timeElement.innerHTML = new Date().toUTCString();
      }
    };
    showTime();
    const interval = setInterval(showTime, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

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
    setCartModalIsOpen(false);
    setLoginModalIsOpen(false);
    setRegisterModalIsOpen(false);
  };

  const handleSteamLogin = () => {
    alert('Логин через Steam (заглушка: реализуйте API Steam)');
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    alert(`Логин через Email: ${email}, Пароль: ${password} (заглушка: реализуйте бэкенд)`);
  };

  const handleGoogleLogin = () => {
    alert('Логин через Google (заглушка: реализуйте API Google)');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    alert(`Регистрация: ${username}, Email: ${email}, Пароль: ${password} (заглушка: реализуйте бэкенд)`);
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
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            VRM
          </div>
          <div className="nav-links">
            <Link to="/sell" onClick={() => openModal('sell')}>
              <i className="fas fa-coins"></i> Продать скины
            </Link>
            <Link to="/" onClick={() => openModal('buy')}>
              <i className="fas fa-shopping-cart"></i> Купить скины
            </Link>
            <Link to="/help" onClick={() => openModal('help')}>
              <i className="fas fa-question-circle"></i> Помощь
            </Link>
            <Link to="/cart" onClick={() => setCartModalIsOpen(true)}>
              <i className="fas fa-shopping-basket"></i> Корзина
            </Link>
            <Link to="/register" onClick={() => setRegisterModalIsOpen(true)}>
              <i className="fas fa-user-plus"></i> Регистрация
            </Link>
            <Link to="/login" onClick={() => setLoginModalIsOpen(true)}>
              <i className="fas fa-sign-in-alt"></i> Вход
            </Link>
          </div>
        </div>
      </nav>

      <div className="full-width title-block">
        ПРОДАЖА И ПОКУПКА ВЕЩЕЙ ИЗ DOTA 2
      </div>

      <div className="full-width benefits-container">
        <div className="benefits-content">
          <div className="benefits">
            <div className="benefit-item" onClick={() => openModal('reliability')}>
              <i className="fas fa-shield-alt benefit-icon"></i>
              <span>НАДЁЖНОСТЬ</span>
            </div>
            <div className="benefit-item" onClick={() => openModal('security')}>
              <i className="fas fa-lock benefit-icon"></i>
              <span>БЕЗОПАСНОСТЬ</span>
            </div>
            <div className="benefit-item" onClick={() => openModal('profit')}>
              <i className="fas fa-dollar-sign benefit-icon"></i>
              <span>ВЫГОДА</span>
            </div>
          </div>
        </div>
      </div>

      <div className="search">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            className="search-text"
            placeholder="Поиск предметов..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="items-grid container">
        {filteredItems.map((item) => (
          <div className="item-card" key={item.id}>
            <Link to={`/item/${item.id}`} className="item-link">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-header">
                <h3>{item.name}</h3>
                <div className="item-price">{item.price.toFixed(2)} ₽</div>
              </div>
              <div className="item-seller">
                <i className="fas fa-user-shield"></i>
                {item.seller}
              </div>
            </Link>
            <div className="item-footer">
              <div className="item-stock">
                <i className="fas fa-cubes"></i>
                {item.stock} шт
              </div>
              <button className="buy-button" onClick={() => addToCart(item)}>
                <i className="fas fa-shopping-cart"></i>
                Добавить в корзину
              </button>
            </div>
          </div>
        ))}
      </div>

      <Routes>
        <Route path="/item/:id" element={<ItemDetail items={items} addToCart={addToCart} />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/help" element={<Help />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <footer>
        © 2025 VRM. Все права защищены.
      </footer>

      {/* Модальное окно для информации */}
      <Modal
        isOpen={modalIsOpen.type !== null}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '500px',
            width: '90%',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <h2>{modalIsOpen.type === 'sell' && 'Продать скины'}
          {modalIsOpen.type === 'buy' && 'Купить скины'}
          {modalIsOpen.type === 'help' && 'Помощь'}
          {modalIsOpen.type === 'reliability' && 'Надёжность'}
          {modalIsOpen.type === 'security' && 'Безопасность'}
          {modalIsOpen.type === 'profit' && 'Выгода'}</h2>
        <p>
          {modalIsOpen.type === 'sell' && 'Здесь вы можете продать свои скины из Dota 2. Выберите предметы и укажите цену.'}
          {modalIsOpen.type === 'buy' && 'Купите редкие скины по выгодным ценам. Используйте поиск для удобства.'}
          {modalIsOpen.type === 'help' && 'Если у вас есть вопросы, обратитесь в нашу поддержку через чат или email.'}
          {modalIsOpen.type === 'reliability' && 'Мы гарантируем безопасные сделки с защитой ваших данных.'}
          {modalIsOpen.type === 'security' && 'Все транзакции защищены современными методами шифрования.'}
          {modalIsOpen.type === 'profit' && 'Получайте больше выгоды благодаря низким комиссиям и акциям.'}
        </p>
        <button onClick={closeModal} className="buy-button">Закрыть</button>
      </Modal>

      {/* Модальное окно для корзины */}
      <Modal
        isOpen={cartModalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            width: '90%',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <h2>Корзина</h2>
        {cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <div className="item-card" key={item.id}>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-header">
                  <h3>{item.name}</h3>
                  <div className="item-price">{item.price.toFixed(2)} ₽</div>
                </div>
                <button className="buy-button" onClick={() => removeFromCart(item.id)}>Удалить</button>
              </div>
            ))}
            <div className="item-price">Итого: {getTotalPrice()} ₽</div>
          </>
        ) : (
          <div className="no-offers">Корзина пуста</div>
        )}
        <button onClick={closeModal} className="buy-button">Закрыть</button>
      </Modal>

      {/* Модальное окно для входа */}
      <Modal
        isOpen={loginModalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            width: '90%',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <h2>Вход</h2>
        <form onSubmit={handleEmailLogin}>
          <input type="email" name="email" placeholder="Email" style={{ width: '100%', margin: '10px 0', padding: '5px' }} required />
          <input type="password" name="password" placeholder="Пароль" style={{ width: '100%', margin: '10px 0', padding: '5px' }} required />
          <button type="submit" className="buy-button" style={{ width: '100%' }}>Войти через Email</button>
        </form>
        <button onClick={handleSteamLogin} className="buy-button" style={{ width: '100%', marginTop: '10px', background: '#00aaff' }}>
          Войти через Steam
        </button>
        <button onClick={handleGoogleLogin} className="buy-button" style={{ width: '100%', marginTop: '10px', background: '#4285f4' }}>
          Войти через Google
        </button>
        <button onClick={closeModal} className="buy-button" style={{ width: '100%', marginTop: '10px' }}>Закрыть</button>
      </Modal>

      {/* Модальное окно для регистрации */}
      <Modal
        isOpen={registerModalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: '#333',
            border: '1px solid #555',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '400px',
            width: '90%',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <h2>Регистрация</h2>
        <form onSubmit={handleRegister}>
          <input type="text" name="username" placeholder="Имя пользователя" style={{ width: '100%', margin: '10px 0', padding: '5px' }} required />
          <input type="email" name="email" placeholder="Email" style={{ width: '100%', margin: '10px 0', padding: '5px' }} required />
          <input type="password" name="password" placeholder="Пароль" style={{ width: '100%', margin: '10px 0', padding: '5px' }} required />
          <button type="submit" className="buy-button" style={{ width: '100%' }}>Зарегистрироваться</button>
        </form>
        <button onClick={handleSteamLogin} className="buy-button" style={{ width: '100%', marginTop: '10px', background: '#00aaff' }}>
          Регистрация через Steam
        </button>
        <button onClick={handleGoogleLogin} className="buy-button" style={{ width: '100%', marginTop: '10px', background: '#4285f4' }}>
          Регистрация через Google
        </button>
        <button onClick={closeModal} className="buy-button" style={{ width: '100%', marginTop: '10px' }}>Закрыть</button>
      </Modal>
    </div>
  );
}

function ItemDetail({ items, addToCart }) {
  const { id } = useParams();
  const item = items.find((i) => i.id === parseInt(id));

  if (!item) return <div>Товар не найден</div>;

  return (
    <div className="container">
      <h1 className="item-title">{item.name}</h1>
      <p className="item-subtitle">{item.subtitle}</p>
      <div className="item-details">
        <div className="item-image">
          <img src={item.image} alt={item.name} className="item-img" />
        </div>
        <div className="item-info">
          <table className="item-table">
            <tr><td>Герой</td><td>{item.hero}</td></tr>
            <tr><td>Слот</td><td>{item.slot}</td></tr>
            <tr><td>Тип</td><td>{item.type}</td></tr>
            <tr><td>Раритетность</td><td>{item.rarity}</td></tr>
            <tr><td>Качество</td><td>{item.quality}</td></tr>
          </table>
          <div className="item-price">{item.price.toFixed(2)} ₽</div>
          <div className="item-steam-price">Steam: {item.steamPrice.toFixed(2)} ₽</div>
          <button className="buy-button" onClick={() => addToCart(item)}>КУПИТЬ СЕЙЧАС</button>
        </div>
      </div>
      <h2 className="offers-title">Текущие предложения</h2>
      {item.offers && item.offers.length > 0 ? (
        <div className="offers-list">
          {item.offers.map((offer, index) => (
            <div className="offer-row" key={index}>
              <div className="offer-price">{offer.price.toFixed(2)} ₽</div>
              <div className="offer-actions">
                <button className="buy-button small now" onClick={() => addToCart(item)}>Купить сейчас</button>
                <button className="buy-button small cart" onClick={() => addToCart(item)}>В корзину</button>
              </div>
              <div className="offer-seller">
                <i className="fas fa-user"></i>
                {offer.seller}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-offers">Никто не продаёт выбранный товар</div>
      )}
    </div>
  );
}

function Sell() {
  return <div className="container"><h1>Продать скины</h1><p>Функция в разработке</p></div>;
}

function Help() {
  return <div className="container"><h1>Помощь</h1><p>Функция в разработке</p></div>;
}

function Register() {
  return <div className="container"><h1>Регистрация</h1><p>Функция в разработке</p></div>;
}

function Login() {
  return <div className="container"><h1>Вход</h1><p>Функция в разработке</p></div>;
}

export default App;