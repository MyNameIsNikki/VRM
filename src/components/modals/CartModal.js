//https://github.com/xJleSx
import React from 'react';
import Modal from 'react-modal';
import './CartModal.css';

const CartModal = ({ 
  isOpen, 
  onRequestClose, 
  cart, 
  removeFromCart, 
  getTotalPrice,
  clearCart,
  isOtherModalOpen
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`cart-modal ${isOtherModalOpen ? 'cart-modal--dimmed' : ''}`}
      overlayClassName="cart-modal-overlay"
      shouldCloseOnOverlayClick={true}
    >
      <div className="cart-modal-header">
        <h2>Корзина</h2>
        <button className="cart-modal-close" onClick={onRequestClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="cart-modal-content">
        {cart.length === 0 ? (
          <div className="cart-empty">
            <i className="fas fa-shopping-cart"></i>
            <p>Ваша корзина пуста</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <div className="item-price-condition">
                      <span className="cart-item-price">{item.price.toFixed(2)}P</span>
                      <span className="item-condition">В наличии: {item.stock} шт</span>
                    </div>
                    <p className="cart-item-seller">Продавец: {item.seller}</p>
                  </div>
                  <button 
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="summary-row">
                <span>Всего:</span>
                <span>{getTotalPrice()}₽</span>
              </div>
              <div className="summary-row">
                <span>Предметов:</span>
                <span>{cart.length}</span>
              </div>
              
              <div className="cart-actions">
              <button className="clear-cart-btn" onClick={clearCart}>
                Очистить корзину
              </button>
                <button className="checkout-button">
                  <i className="fas fa-shopping-cart"></i>
                  Купить
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CartModal;