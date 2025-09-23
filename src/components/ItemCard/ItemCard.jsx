//https://github.com/xJleSx
import React from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css';

const ItemCard = ({ item, addToCart, cart }) => {
  const itemCount = cart.filter(cartItem => cartItem.id === item.id).length;

  return (
    <div className="item-card">
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
        <button 
          className={`buy-button ${itemCount > 0 ? 'in-cart' : ''}`} 
          onClick={() => addToCart(item)}
        >
          {itemCount > 0 ? (
            <>
              <i className="fas fa-check"></i>
              В корзине: {itemCount}
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart"></i>
              Добавить в корзину
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;