-- USERS TABLE (for accounts/login)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS TABLE (digital goods)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INT NOT NULL,          -- price in cents (e.g. $4.99 = 499)
    file_path VARCHAR(500),           -- where the digital file is stored
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PURCHASES TABLE (who bought what)
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stripe_payment_id VARCHAR(255)     -- for verifying payment with Stripe
);
