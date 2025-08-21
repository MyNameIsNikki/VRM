import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItemDetailPage.css';

const ItemDetailPage = ({ items, addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = items.find((i) => i.id === parseInt(id));

  if (!item) {
    return (
      <div className="container">
        <h2>Товар не найден</h2>
        <button className="buy-button" onClick={() => navigate('/')}>
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="container item-detail">
      <h1 className="item-title">{item.name}</h1>
      <p className="item-subtitle">{item.subtitle}</p>
      <div className="item-details">
        <div className="item-image">
  <img 
    src={item.image} 
    alt={item.name} 
    className="item-img"
    onError={(e) => {
      e.target.onerror = null; 
      e.target.src = 'placeholder-image-url';
    }}
  />
</div>
        <div className="item-info">
          <table className="item-table">
            <tbody>
              <tr><td>Герой</td><td>{item.hero}</td></tr>
              <tr><td>Слот</td><td>{item.slot}</td></tr>
              <tr><td>Тип</td><td>{item.type}</td></tr>
              <tr><td>Раритетность</td><td>{item.rarity}</td></tr>
              <tr><td>Качество</td><td>{item.quality}</td></tr>
            </tbody>
          </table>
          <div className="price-block">
            <div className="item-price">{item.price.toFixed(2)} ₽</div>
            <div className="item-steam-price">Steam: {item.steamPrice.toFixed(2)} ₽</div>
            <button className="buy-button" onClick={() => addToCart(item)}>КУПИТЬ СЕЙЧАС</button>
          </div>
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
      
      <div className="back-to-home">
        <button className="buy-button" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i> Вернуться на главную
        </button>
      </div>
    </div>
  );
};

export default ItemDetailPage;