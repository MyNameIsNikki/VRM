import React from 'react';
import Modal from 'react-modal';
import './/modals.css';

const CartModal = ({ isOpen, onRequestClose, cart, removeFromCart, getTotalPrice }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <h2>Корзина</h2>
      {cart.length > 0 ? (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <div className="cart-item-price">{item.price.toFixed(2)} ₽</div>
                </div>
                <button 
                  className="remove-button" 
                  onClick={() => removeFromCart(item.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <span>Итого:</span>
            <span className="total-price">{getTotalPrice()} ₽</span>
          </div>
          <button className="checkout-button">Оформить заказ</button>
        </>
      ) : (
        <div className="no-offers">Корзина пуста</div>
      )}
      <button onClick={onRequestClose} className="close-button">Закрыть</button>
    </Modal>
  );
};

export default CartModal;