import React from 'react';
import Benefits from '../components/Benefits/Benefits';
import './HomePage.css';

const HomePage = ({ 
  openModal, 
  recentlySold, 
  statsData 
}) => {
  // Функция для форматирования чисел с условным добавлением "+"
  const formatStatValue = (value, threshold) => {
    const numValue = parseInt(value);
    return numValue > threshold ? `${value}+` : value;
  };

  return (
    <div>
      <div className="full-width title-block">
        ПРОДАЖА И ПОКУПКА ВЕЩЕЙ ИЗ DOTA 2
      </div>

      <Benefits openModal={openModal} />

      <div className="homepage-hero">
        <div className="hero-content">
          <h1>Добро пожаловать в VRM</h1>
          <p>Лучший маркетплейс для покупки и продажи предметов из Dota 2</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">
                {formatStatValue(statsData.totalSold, 500)}
              </span>
              <span className="hero-stat-label">Проданных предметов</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">{statsData.averageRating}</span>
              <span className="hero-stat-label">Средний рейтинг</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">
                {formatStatValue(statsData.totalReviews, 100)}
              </span>
              <span className="hero-stat-label">Отзывов</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recently-sold-section">
        <h2 className="section-title">Недавно продано</h2>
        <div className="recently-sold-container">
          {recentlySold.map((item) => (
            <div key={item.id} className="sold-item">
              <img src={item.image} alt={item.name} />
              <div className="sold-item-info">
                <span className="sold-item-name">{item.name}</span>
                <span className="sold-item-price">{item.price.toFixed(2)} ₽</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Почему выбирают нас</h2>
        <div className="features-container">
          <div className="feature">
            <i className="fas fa-shield-alt feature-icon"></i>
            <h3>Безопасность</h3>
            <p>Гарантируем безопасность всех сделок</p>
          </div>
          <div className="feature">
            <i className="fas fa-rocket feature-icon"></i>
            <h3>Скорость</h3>
            <p>Мгновенная доставка предметов</p>
          </div>
          <div className="feature">
            <i className="fas fa-headset feature-icon"></i>
            <h3>Поддержка</h3>
            <p>Круглосуточная поддержка клиентов</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;