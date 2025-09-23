# 🛒 VRM — Virtual Russian Market

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/MyNameIsNikki/VRM/blob/main/LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

**Твой виртуальный рынок для безопасной покупки и продажи скинов и предметов Dota 2.**  
Покупай, продавай и обменивай крутые вещи с гарантией безопасности и мгновенными сделками через Steam.

---

## ✨ Оглавление

- [🔥 Что такое VRM?](#-что-такое-vrm)
- [🚀 Возможности](#-возможности)
- [🛠 Технологический стек](#-технологический-стек)
- [📦 Установка и запуск](#-установка-и-запуск)
  - [Предварительные требования](#предварительные-requirements)
  - [Локальная разработка](#-локальная-разработка)
- [🌐 Как пользоваться](#-как-пользоваться)
  - [Для покупателей](#-для-покупателей)
  - [Для продавцов](#-для-продавцов)
- [📁 Структура проекта](#-структура-проекта)
- [🤝 Contributing](#-contributing)
- [📜 Правила использования](#-правила-использования)
- [⚖️ Лицензия](#-лицензия)
- [🔗 Ссылки](#-ссылки)

---

## 🔥 Что такое VRM?

**VRM (Virtual Russian Market)** — это специализированная торговая площадка, созданная для сообщества Dota 2. Мы предоставляем безопасную и удобную среду для трейдинга внутриигровыми предметами, скинами и аккаунтами.

**Ключевая цель:** Устранить риски мошенничества и сделать процесс торговли простым, быстрым и надежным.

---

## 🚀 Возможности

- **🔒 Безопасные сделки:** Используется Escrow-система и строгая модерация для защиты пользователей.
- **⚡ Мгновенные трейды:** Интеграция с Steam API позволяет проводить обмены автоматически и моментально.
- **📊 Система рейтингов:** Выбирайте продавцов с лучшей репутацией для уверенности в сделке.
- **💸 Гибкая оплата:** Поддержка СБП и других удобных способов оплаты.
- **🔔 Умные уведомления:** Следите за статусом ваших сделок, новыми предложениями и ценами.
- **🎯 Поиск и фильтры:** Легко находите даже самые редкие и коллекционные предметы.

---

## 🛠 Технологический стек

| Часть проекта       | Технологии                                                                 |
|---------------------|----------------------------------------------------------------------------|
| **Фронтенд**        | React, Next.js, TailwindCSS                                                |
| **Бэкенд**          | Node.js, Express.js                                                        |
| **База данных**     | PostgreSQL                                                                 |
| **Аутентификация**  | Steam OpenID, JWT                                                          |
| **Деплой (Frontend)** | GitHub Pages                                                               |
| **Иконки/Графика**  | SVG (Кастомные иконки для всего интерфейса)                                |

---

## 📦 Установка и запуск

### Предварительные требования

Перед началом убедитесь, что на вашей системе установлены:
- **Node.js** (версия 18 или выше)
- **npm** (обычно идет в комплекте с Node.js)
- **Git**
- **PostgreSQL** (если планируется работа с реальной БД, а не `db.json`)

### 🖥 Локальная разработка

1.  **Клонируйте репозиторий:**
    ```bash
    git clone https://github.com/MyNameIsNikki/VRM.git
    cd VRM
    ```

2.  **Установите зависимости для клиентской и серверной частей:**
    ```bash
    # Установка зависимостей для фронтенда (из корня проекта)
    npm install

    # Установка зависимостей для бэкенда
    cd server
    npm install
    cd ..
    ```

3.  **Настройте переменные окружения:**
    *   Перейдите в папку `server/`.
    *   Отредактируйте файл `.env`, указав свои данные для подключения к БД, секретный ключ для JWT и настройки Steam API.
    *   Пример содержимого `.env`:
        ```bash
        DB_HOST=localhost
        DB_USER=your_username
        DB_PASS=your_password
        DB_NAME=vrm_database
        JWT_SECRET=your_super_secret_jwt_key
        STEAM_API_KEY=your_steam_web_api_key
        CLIENT_URL=http://localhost:3000
        ```

4.  **Инициализируйте базу данных (опционально):**
    *   Если вы используете PostgreSQL, выполните SQL-скрипт из `server/db.sql`.
    *   Для разработки можно использовать файловую БД `server/data/db.json`.

5.  **Запустите серверы:**
    ```bash
    # Запуск бэкенд-сервера (из папки server)
    cd server
    node server.js
    # Сервер запустится на http://localhost:5000

    # В отдельном терминале запустите фронтенд (из корневой папки проекта)
    npm start
    # Клиент запустится на http://localhost:3000
    ```

Теперь проект должен быть доступен по адресу `http://localhost:3000`.

---

## 🌐 Как пользоваться

### 🛍 Для покупателей
1.  **Авторизуйтесь** на сайте через свой Steam аккаунт.
2.  **Найдите предмет** с помощью поиска или фильтров.
3.  **Добавьте** понравившийся товар в корзину.
4.  **Оплатите заказ** с помощью доступных способов (СБП).
5.  **Получите предмет** мгновенно в свой Steam-инвентарь через автоматический обмен.

### 📈 Для продавцов
1.  **Зарегистрируйтесь** и настройте свой профиль, указав Trade URL.
2.  **Выставите предметы** на продажу: укажите название, описание, цену и загрузите изображения.
3.  **Управляйте своими лотами** в личном кабинете.
4.  **Получайте уведомления** о покупках и подтверждайте обмены.
5.  **Выводите заработанные средства.**

---

## 📁 Структура проекта
```
└── 📁 VRM
    ├── 📁 .github
    │   └── 📄 workflows
    ├── 📁 image
    │   ├── 📄 Авторизация 2.svg
    │   ├── 📄 Авторизация 3.svg
    │   ├── 📄 Авторизация.svg
    │   ├── 📄 Бакс.svg
    │   ├── 📄 Баланс.svg
    │   ├── 📄 Большая корзина.svg
    │   ├── 📄 Галочка.svg
    │   ├── 📄 Замок.svg
    │   ├── 📄 Корзина.svg
    │   ├── 📄 Купить.svg
    │   ├── 📄 Лайк.svg
    │   ├── 📄 Лого.svg
    │   ├── 📄 Нижняя планка.svg
    │   ├── 📄 Панель.svg
    │   ├── 📄 Плюсик.svg
    │   ├── 📄 Поисковик.svg
    │   ├── 📄 Пользователь побольше.svg
    │   ├── 📄 Пользователь.svg
    │   ├── 📄 Предмет.svg
    │   ├── 📄 Предметы.svg
    │   ├── 📄 Привязка.svg
    │   ├── 📄 Собака(пьёс).svg
    │   ├── 📄 Список.svg
    │   ├── 📄 Управление аккаунтом.svg
    │   ├── 📄 Урна.svg
    │   ├── 📄 Хештег.svg
    │   └── 📄 FAQ.svg
    ├── 📁 node_modules
    ├── 📁 public
    │   ├── 📄 favicon.ico
    │   ├── 📄 index.html
    │   ├── 📄 logo192.png
    │   ├── 📄 logo512.png
    │   ├── 📄 manifest.json
    │   └── 📄 robots.txt
    ├── 📁 server
    │   ├── 📁 data
    │   │   └── 📄 db.json
    │   ├── 📁 node_modules
    │   ├── 📁 routes
    │   │   ├── 📄 auth.js
    │   │   ├── 📄 items.js
    │   │   ├── 📄 orders.js
    │   │   ├── 📄 purchaseHistory.js
    │   │   └── 📄 sellers.js
    │   ├── 📄 .env
    │   ├── 📄 data_db.js
    │   ├── 📄 db.js
    │   ├── 📄 db.sql
    │   ├── 📄 package-lock.json
    │   ├── 📄 package.json
    │   └── 📄 server.js
    ├── 📁 src
    │   ├── 📁 assets
    │   │   ├── 📄 Avowance.png
    │   │   ├── 📄 Avowance.svg
    │   │   ├── 📄 Dragonclaw Hook.png
    │   │   ├── 📄 Dragonclaw Hook.svg
    │   │   ├── 📄 Exalted Feast of Abscession - Back.png
    │   │   ├── 📄 Exalted Feast of Abscession - Back.svg
    │   │   ├── 📄 Fractal Horns of Inner Abysm.svg
    │   │   ├── 📄 Genuine Ice Baby Roshan.svg
    │   │   ├── 📄 Golden Basher Blades.svg
    │   │   ├── 📄 Golden Crucible of Rile.svg
    │   │   ├── 📄 Golden Profane Union.svg
    │   │   ├── 📄 Golden Shadow Masque.svg
    │   │   ├── 📄 Head of the Odobenus One.svg
    │   │   ├── 📄 Inscribed Bracers of Aeons of the Crimson Witness.svg
    │   │   ├── 📄 Soul Diffuser.svg
    │   │   └── 📄 VRM.png
    │   ├── 📁 components
    │   │   ├── 📁 Benefits
    │   │   │   ├── 📄 Benefits.css
    │   │   │   └── 📄 Benefits.jsx
    │   │   ├── 📁 filters
    │   │   │   ├── 📄 CategoryFilter.css
    │   │   │   ├── 📄 CategoryFilter.jsx
    │   │   │   ├── 📄 PriceFilter.css
    │   │   │   └── 📄 PriceFilter.jsx
    │   │   ├── 📁 Header
    │   │   │   ├── 📄 Header.css
    │   │   │   └── 📄 Header.jsx
    │   │   ├── 📁 ItemCard
    │   │   │   ├── 📄 ItemCard.css
    │   │   │   └── 📄 ItemCard.jsx
    │   │   ├── 📁 modals
    │   │   │   ├── 📄 AuthModal.css
    │   │   │   ├── 📄 AuthModal.js
    │   │   │   ├── 📄 CartModal.css
    │   │   │   ├── 📄 CartModal.js
    │   │   │   ├── 📄 InfoModal.js
    │   │   │   ├── 📄 modals.css
    │   │   │   ├── 📄 RegisterModal.css
    │   │   │   ├── 📄 RegisterModal.js
    │   │   │   ├── 📄 RulesModal.css
    │   │   │   ├── 📄 RulesModal.js
    │   │   │   ├── 📄 SecurityPolicyModal.css
    │   │   │   ├── 📄 SecurityPolicyModal.js
    │   │   │   ├── 📄 TermsModal.css
    │   │   │   ├── 📄 TermsModal.js
    │   │   │   ├── 📄 TradeRulesModal.css
    │   │   │   └── 📄 TradeRulesModal.js
    │   │   ├── 📁 SearchBar
    │   │   │   ├── 📄 SearchBar.css
    │   │   │   └── 📄 SearchBar.jsx
    │   │   ├── 📄 ToastNotification.css
    │   │   └── 📄 ToastNotification.js
    │   ├── 📁 data
    │   │   └── 📄 items.jsx
    │   ├── 📁 pages
    │   │   ├── 📄 HelpPage.css
    │   │   ├── 📄 HelpPage.jsx
    │   │   ├── 📄 HomePage.css
    │   │   ├── 📄 HomePage.jsx
    │   │   ├── 📄 ItemDetailPage.css
    │   │   ├── 📄 ItemDetailPage.jsx
    │   │   ├── 📄 ShopPage.css
    │   │   └── 📄 ShopPage.jsx
    │   ├── 📁 services
    │   │   ├── 📄 api.js
    │   │   ├── 📄 authService.js
    │   │   ├── 📄 itemService.js
    │   │   └── 📄 orderService.js
    │   ├── 📄 .env
    │   ├── 📄 App.css
    │   ├── 📄 App.js
    │   ├── 📄 App.test.js
    │   ├── 📄 index.css
    │   ├── 📄 index.js
    │   ├── 📄 logo.svg
    │   ├── 📄 reportWebVitals.js
    │   └── 📄 setupTests.js
    ├── 📄 .gitignore
    ├── 📄 package-lock.json
    ├── 📄 package.json
    └── 📄 README.md
21 directories, 123 files
```
---

## 📜 Правила использования

*   ✅ **Разрешено:** Торговля легальными предметами, приобретенными в Steam.
*   ❌ **Запрещено:** Любое мошенничество, использование читов, багов, попытки обмена нелегальными предметами.
*   ⚠️ **Администрация** оставляет за собой право отменять подозрительные сделки и блокировать аккаунты нарушителей.

---

## ⚖️ Лицензия

Этот проект распространяется под лицензией **MIT**. Подробнее см. в файле `LICENSE`.

> **Disclaimer:** Данный проект не аффилирован с Valve Corporation, Steam или Dota 2. Все упомянутые торговые марки являются собственностью их правообладателей.

---

## 🔗 Ссылки

- **Демо-сайт:** [Выложим когда будет готово на GitHub Pages]
- **Репозиторий:** [https://github.com/MyNameIsNikki/VRM](https://github.com/MyNameIsNikki/VRM)
- **Steam:** [https://store.steampowered.com](https://store.steampowered.com)
- **Valve:** [https://www.valvesoftware.com](https://www.valvesoftware.com)
<p align="center"> <strong>Сделано с ❤️ для сообщества Dota 2</strong> </p>