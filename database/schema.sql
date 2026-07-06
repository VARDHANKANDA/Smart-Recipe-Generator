CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  dietary_preferences TEXT DEFAULT '',
  allergies TEXT DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  cuisine VARCHAR(80) NOT NULL,
  difficulty VARCHAR(40) NOT NULL,
  diet VARCHAR(80) NOT NULL,
  calories INT NOT NULL,
  protein FLOAT NOT NULL,
  carbs FLOAT NOT NULL,
  fat FLOAT NOT NULL,
  prep_time INT NOT NULL,
  cook_time INT NOT NULL,
  servings INT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  tags JSONB NOT NULL,
  rating FLOAT DEFAULT 4.5,
  views INT DEFAULT 0,
  saves INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pantry_items (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  quantity FLOAT NOT NULL,
  unit VARCHAR(40) NOT NULL,
  category VARCHAR(80) NOT NULL,
  expiry_date DATE,
  low_stock_threshold FLOAT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, recipe_id)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meal_plans (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE,
  planned_date DATE NOT NULL,
  slot VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS shopping_items (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  quantity FLOAT NOT NULL,
  unit VARCHAR(40) NOT NULL,
  category VARCHAR(80) NOT NULL,
  checked BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_diet ON recipes(diet);
CREATE INDEX IF NOT EXISTS idx_recipes_calories ON recipes(calories);
CREATE INDEX IF NOT EXISTS idx_pantry_user ON pantry_items(user_id);

