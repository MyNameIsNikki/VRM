import React from 'react';
import Modal from 'react-modal';
import './/modals.css';

const InfoModal = ({ isOpen, onRequestClose, type }) => {
  const getModalContent = () => {
    switch (type) {
      case 'sell':
        return {
          title: 'Продать скины',
          content: 'Здесь вы можете продать свои скины из Dota 2. Выберите предметы и укажите цену'
        };
      case 'buy':
        return {
          title: 'Купить скины',
          content: 'Купите редкие скины по выгодным ценам. Используйте поиск для удобства'
        };
      case 'help':
        return {
          title: 'Помощь',
          content: 'Если у вас есть вопросы, обратитесь в нашу поддержку через чат или email'
        };
      case 'reliability':
        return {
          title: 'Надёжность',
          content: 'Мы гарантируем безопасные сделки с защитой ваших данных. Стабильно. Без сбоев. 24/7'
          
        };
      case 'security':
        return {
          title: 'Безопасность',
          content: 'Все транзакции защищены современными методами шифрования'
        };
      case 'profit':
        return {
          title: 'Выгода',
          content: 'Получайте больше выгоды благодаря низким комиссиям и акциям'
        };
      default:
        return { title: '', content: '' };
    }
  };

  const { title, content } = getModalContent();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="custom-modal"
      overlayClassName="custom-overlay"
    >
      <h2>{title}</h2>
      <p>{content}</p>
      <button onClick={onRequestClose} className="buy-button">Закрыть</button>
    </Modal>
  );
};

export default InfoModal;