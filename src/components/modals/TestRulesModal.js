//https://github.com/xJleSx
import React, { useState } from 'react';
import Modal from 'react-modal';
import './TestRulesModal.css';

const TestRulesModal = ({ isOpen, onRequestClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      question: "Минимальная сумма сделки на платформе составляет:",
      options: ["$0.5", "$1", "$5", "$10"],
      correct: 1
    },
    {
      question: "Комиссия платформы составляет:",
      options: ["1-3%", "5-10%", "10-15%", "15-20%"],
      correct: 1
    },
    {
      question: "Возврат предметов возможен:",
      options: [
        "Если предмет не понравился",
        "Только в случае технических сбоев платформы",
        "В течение 14 дней после покупки",
        "Если цена на предмет изменилась"
      ],
      correct: 1
    },
    {
      question: "VRM Marketplace несет ответственность за:",
      options: [
        "Блокировку предметов Valve Corporation",
        "Изменение рыночной стоимости предметов",
        "Безопасность сделок на платформе",
        "Все перечисленное"
      ],
      correct: 2
    },
    {
      question: "Запрещено:",
      options: [
        "Создавать искусственный спрос/предложение",
        "Торговать предметами от $10",
        "Продавать более 5 предметов в день",
        "Все перечисленное"
      ],
      correct: 0
    }
  ];

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsSubmitted(false);
    onRequestClose();
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsSubmitted(false);
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const score = calculateScore();
  const isPassed = score >= 4; // 4 из 5 правильных ответов для прохождения

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="test-rules-modal"
      overlayClassName="test-rules-overlay"
      contentLabel="Тест по правилам торговли"
    >
      <div className="test-rules-modal-header">
        <h2>Тест по правилам торговли</h2>
        <button onClick={handleClose} className="close-btn">&times;</button>
      </div>
      <div className="test-rules-modal-content">
        {!isSubmitted ? (
          <>
            <div className="test-progress">
              Вопрос {currentQuestion + 1} из {questions.length}
            </div>
            <div className="test-question">
              <h3>{questions[currentQuestion].question}</h3>
              <div className="test-options">
                {questions[currentQuestion].options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex} 
                    className={`test-option ${answers[currentQuestion] === optionIndex ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelect(currentQuestion, optionIndex)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className="test-navigation">
              {currentQuestion > 0 && (
                <button 
                  className="test-nav-btn prev"
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                >
                  Назад
                </button>
              )}
              {currentQuestion < questions.length - 1 ? (
                <button 
                  className="test-nav-btn next"
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  disabled={answers[currentQuestion] === undefined}
                >
                  Далее
                </button>
              ) : (
                <button 
                  className="test-submit-btn"
                  onClick={handleSubmit}
                  disabled={answers[currentQuestion] === undefined}
                >
                  Завершить тест
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="test-results">
            {isPassed ? (
              <>
                <div className="test-success">
                  <h3>Тест пройден!</h3>
                  <p>Ваши ответы отправлены на модерацию администрации.</p>
                  <p>Результат: {score} из {questions.length} правильных ответов</p>
                </div>
                <div className="test-moderator-note">
                  <p>Администратор проверит ваши ответы и свяжется с вами в течение 24 часов.</p>
                </div>
              </>
            ) : (
              <>
                <div className="test-fail">
                  <h3>Тест не пройден</h3>
                  <p>Для успешного прохождения необходимо правильно ответить как минимум на 4 из 5 вопросов.</p>
                  <p>Ваш результат: {score} из {questions.length}</p>
                </div>
                <button className="test-retry-btn" onClick={handleRestart}>
                  Попробовать снова
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TestRulesModal;