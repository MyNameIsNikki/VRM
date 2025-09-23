//https://github.com/xJleSx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ItemDetailPage.css';

const ItemDetailPage = ({ items, addToCart, cart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = items.find((i) => i.id === parseInt(id));

  if (!item) {
    return (
      <div className="container">
        <h2>Товар не найден</h2>
        <button className="buy-button" onClick={() => navigate('/shop')}>
          <i className="fas fa-store"></i> Вернуться в магазин
        </button>
      </div>
    );
  }

  const itemCount = cart.filter(cartItem => cartItem.id === item.id).length;

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
            <button 
              className={`buy-button ${itemCount > 0 ? 'in-cart' : ''}`}
              onClick={() => addToCart(item)}
            >
              {itemCount > 0 ? `В КОРЗИНЕ: ${itemCount}` : 'КУПИТЬ СЕЙЧАС'}
            </button>
          </div>
        </div>
      </div>
      <h2 className="offers-title">Текущие предложения</h2>
      {item.offers && item.offers.length > 0 ? (
        <div className="offers-list">
          {item.offers.map((offer, index) => {
            const offerItem = { ...item, price: offer.price, seller: offer.seller };
            const offerCount = cart.filter(cartItem => cartItem.id === item.id).length;
            
            return (
              <div className="offer-row" key={index}>
                <div className="offer-price">{offer.price.toFixed(2)} ₽</div>
                <div className="offer-actions">
                  <button className="buy-button small now" onClick={() => addToCart(offerItem)}>Купить сейчас</button>
                  <button 
                    className={`buy-button small cart ${offerCount > 0 ? 'in-cart' : ''}`}
                    onClick={() => addToCart(offerItem)}
                  >
                    {offerCount > 0 ? `В корзине: ${offerCount}` : 'В корзину'}
                  </button>
                </div>
                <div className="offer-seller">
                  <i className="fas fa-user"></i>
                  {offer.seller}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="no-offers">Никто не продаёт выбранный товар</div>
      )}
      
      <div className="back-to-home">
        <button className="buy-button" onClick={() => navigate('/shop')}>
          <i className="fas fa-arrow-left"></i> Вернуться в магазин
        </button>
      </div>
    </div>
  );
};

export default ItemDetailPage;