CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  login TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  link TEXT,
  flag BOOLEAN DEFAULT false,
  registrationtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sellers (
  id_prodavca SERIAL PRIMARY KEY,
  link TEXT,
  id_polz INTEGER REFERENCES users(id)
);
