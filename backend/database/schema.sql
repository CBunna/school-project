-- Beskydy Tourism Database Schema
-- PostgreSQL 15+

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS accommodation CASCADE;
DROP TABLE IF EXISTS attractions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (for authentication and user management)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attractions table
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    elevation INTEGER,
    image_url VARCHAR(500),
    category VARCHAR(50),
    rating DECIMAL(2,1),
    is_custom BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accommodation table
CREATE TABLE accommodation (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('hotel', 'pension', 'cottage', 'hostel')),
    description TEXT,
    location VARCHAR(255),
    price_per_night DECIMAL(10,2),
    capacity INTEGER,
    amenities TEXT[],
    image_url VARCHAR(500),
    rating DECIMAL(2,1),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('hiking', 'skiing', 'cultural', 'adventure', 'relaxation')),
    description TEXT,
    duration VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'moderate', 'hard', 'expert')),
    price DECIMAL(10,2),
    season VARCHAR(50),
    image_url VARCHAR(500),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    booking_type VARCHAR(50) CHECK (booking_type IN ('accommodation', 'activity')),
    item_id INTEGER NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    number_of_guests INTEGER DEFAULT 1,
    total_price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table (for contact form submissions)
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table (users can save favorite attractions, accommodation, or activities)
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) CHECK (item_type IN ('attraction', 'accommodation', 'activity')),
    item_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_type, item_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_accommodation_type ON accommodation(type);
CREATE INDEX idx_activities_type ON activities(type);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_item_type ON favorites(item_type);

-- Insert sample data

-- Sample users (passwords: admin@beskydy.cz = adminpass123, user@beskydy.cz = userpass123)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@beskydy.cz', '$2b$10$njVllE3h9Eg.n6L252fTxeXosf8Exy0tTsmxxPb7PDz.2eNVmeY8G', 'Admin', 'Beskydy', 'admin'),
('user@beskydy.cz', '$2b$10$tqEPVgExzyDCib3d8E57uew18/H0iELrWTGTksjCZtbuSbw8sdktq', 'Jan', 'Novák', 'user'),
('marie.svobodova@email.cz', '$2b$10$tqEPVgExzyDCib3d8E57uew18/H0iELrWTGTksjCZtbuSbw8sdktq', 'Marie', 'Svobodová', 'user');

-- Sample attractions
INSERT INTO attractions (name, description, location, elevation, image_url, category, rating) VALUES
('Lysá Hora', 'The highest peak of the Moravian-Silesian Beskydy mountains at 1,323 meters. Offers breathtaking panoramic views and is a popular hiking destination year-round.', 'Moravian-Silesian Region', 1323, '../images/lysa-hora.jpg', 'mountain', 4.8),
('Pustevny', 'A mountain saddle featuring unique wooden architecture by Dušan Jurkovič. Famous for traditional Wallachian buildings and stunning mountain views.', 'Moravian-Silesian Region', 1018, '../images/pustevny.jpg', 'cultural', 4.7),
('Radhošť', 'Legendary mountain with a statue of the pagan god Radegast and the Chapel of Saints Cyril and Methodius. Rich in folklore and natural beauty.', 'Moravian-Silesian Region', 1129, '../images/radhošť.jpg', 'cultural', 4.6),
('Štramberk Castle', 'Medieval castle ruins with a distinctive tower "Trúba" overlooking the picturesque town of Štramberk.', 'Štramberk', 425, '../images/stramberk.jpg', 'historical', 4.5),
('Wallachian Open Air Museum', 'Large open-air museum showcasing traditional Wallachian wooden architecture and lifestyle from the 17th-19th centuries.', 'Rožnov pod Radhoštěm', 380, '../images/museum.jpg', 'cultural', 4.7);

-- Sample accommodation
INSERT INTO accommodation (name, type, description, location, price_per_night, capacity, amenities, image_url, rating, available) VALUES
('Hotel Lysá', 'hotel', 'Modern mountain hotel with spa facilities, restaurant, and stunning views of Lysá Hora.', 'Ostravice', 2500.00, 4, ARRAY['wifi', 'parking', 'restaurant', 'spa', 'gym'], '../images/hotel-lysa.jpg', 4.5, true),
('Pension Beskydy', 'pension', 'Family-run pension offering cozy rooms and traditional Wallachian cuisine.', 'Rožnov pod Radhoštěm', 1200.00, 2, ARRAY['wifi', 'parking', 'breakfast', 'garden'], '../images/pension.jpg', 4.3, true),
('Mountain Cottage Radegast', 'cottage', 'Rustic cottage perfect for families or groups seeking authentic mountain experience.', 'Pustevny', 3500.00, 8, ARRAY['kitchen', 'fireplace', 'parking', 'mountain-view'], '../images/cottage.jpg', 4.6, true),
('Hostel Beskydská', 'hostel', 'Budget-friendly hostel popular among hikers and young travelers.', 'Frýdlant nad Ostravicí', 450.00, 1, ARRAY['wifi', 'shared-kitchen', 'lockers'], '../images/hostel.jpg', 4.1, true),
('Wellness Hotel Horal', 'hotel', 'Luxury hotel with extensive wellness center, indoor pool, and fine dining.', 'Rožnov pod Radhoštěm', 3800.00, 2, ARRAY['wifi', 'parking', 'spa', 'pool', 'restaurant', 'bar'], '../images/wellness.jpg', 4.8, true);

-- Sample activities
INSERT INTO activities (name, type, description, duration, difficulty, price, season, image_url, available) VALUES
('Summit Hike to Lysá Hora', 'hiking', 'Guided hike to the highest peak of Beskydy with experienced mountain guide.', '6 hours', 'moderate', 800.00, 'Spring-Fall', '../images/hiking.jpg', true),
('Ski Pass - Pustevny', 'skiing', 'Full-day ski pass with access to all slopes and lifts at Pustevny ski resort.', 'Full day', 'easy', 1200.00, 'Winter', '../images/skiing.jpg', true),
('Wallachian Folklore Evening', 'cultural', 'Traditional evening with Wallachian music, dance, and local cuisine.', '3 hours', 'easy', 650.00, 'Year-round', '../images/folklore.jpg', true),
('Mountain Biking Tour', 'adventure', 'Exciting mountain biking tour through Beskydy trails with bike rental included.', '4 hours', 'hard', 1100.00, 'Spring-Fall', '../images/biking.jpg', true),
('Spa & Wellness Day', 'relaxation', 'Full day access to spa facilities including massages, sauna, and relaxation zones.', 'Full day', 'easy', 1800.00, 'Year-round', '../images/spa.jpg', true),
('Photography Workshop', 'cultural', 'Learn landscape photography with professional photographer in stunning mountain locations.', '5 hours', 'moderate', 1500.00, 'Spring-Fall', '../images/photo.jpg', true);

-- Sample bookings
INSERT INTO bookings (user_id, booking_type, item_id, check_in_date, check_out_date, number_of_guests, total_price, status, special_requests) VALUES
(2, 'accommodation', 1, '2026-05-15', '2026-05-18', 2, 7500.00, 'confirmed', 'Late check-in please'),
(2, 'activity', 1, '2026-05-16', NULL, 2, 1600.00, 'confirmed', NULL),
(3, 'accommodation', 2, '2026-06-01', '2026-06-05', 2, 4800.00, 'pending', 'Vegetarian breakfast options'),
(3, 'activity', 3, '2026-06-02', NULL, 2, 1300.00, 'pending', NULL);

-- Sample contact messages
INSERT INTO contacts (name, email, phone, subject, message, status) VALUES
('Petr Dvořák', 'petr.dvorak@email.cz', '+420 777 888 999', 'Group booking inquiry', 'Hello, I would like to inquire about group booking for 15 people in July. Can you provide a special rate?', 'new'),
('Eva Černá', 'eva.cerna@email.cz', '+420 606 555 444', 'Wedding venue', 'Is it possible to organize a wedding reception at your hotel? We are looking for a venue for 80 guests.', 'read'),
('Tomáš Procházka', 'tomas.prochazka@email.cz', NULL, 'Hiking trails information', 'Could you provide more information about hiking trails difficulty levels and estimated times?', 'responded');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for bookings table
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Display summary
SELECT 'Database schema created successfully!' as status;
SELECT 'Sample data inserted' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_attractions FROM attractions;
SELECT COUNT(*) as total_accommodation FROM accommodation;
SELECT COUNT(*) as total_activities FROM activities;
SELECT COUNT(*) as total_bookings FROM bookings;
SELECT COUNT(*) as total_contacts FROM contacts;
SELECT COUNT(*) as total_favorites FROM favorites;
