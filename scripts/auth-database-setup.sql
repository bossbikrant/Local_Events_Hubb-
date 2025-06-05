-- Enhanced Local Events Hub Database Setup with Authentication
-- Tech & Startup Theme
-- Created: 2024-02-01
-- Updated: 2024-02-05 (Added proper authentication)

-- Create database
CREATE DATABASE IF NOT EXISTS local_events_hub;
USE local_events_hub;

-- Enhanced Users table with proper authentication fields
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    interests JSON,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_email_verification_token (email_verification_token),
    INDEX idx_password_reset_token (password_reset_token),
    INDEX idx_created_at (created_at)
);

-- Events table (unchanged)
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    organizer VARCHAR(100) NOT NULL,
    max_attendees INT NOT NULL DEFAULT 50,
    image_url VARCHAR(255),
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date (event_date),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
);

-- RSVPs table (unchanged)
CREATE TABLE rsvps (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36) NOT NULL,
    status ENUM('going', 'maybe', 'not_going') DEFAULT 'going',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_event (user_id, event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_event_id (event_id)
);

-- Comments table (unchanged)
CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);

-- Enhanced user sessions table for JWT token management
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    refresh_token VARCHAR(255),
    device_info TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_expires_at (expires_at)
);

-- Login attempts tracking table
CREATE TABLE login_attempts (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(100),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_ip_address (ip_address),
    INDEX idx_attempted_at (attempted_at)
);

-- Notifications table (unchanged)
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    event_id VARCHAR(36),
    type ENUM('event_reminder', 'event_update', 'new_comment', 'rsvp_confirmation', 'welcome') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Create indexes for better performance
CREATE INDEX idx_events_date_category ON events(event_date, category);
CREATE INDEX idx_rsvps_status ON rsvps(status);
CREATE INDEX idx_comments_event_created ON comments(event_id, created_at);
CREATE INDEX idx_users_last_login ON users(last_login);
CREATE INDEX idx_sessions_user_expires ON user_sessions(user_id, expires_at);

-- Create views for common queries
CREATE VIEW event_with_attendee_count AS
SELECT 
    e.*,
    COALESCE(r.attendee_count, 0) as current_attendees
FROM events e
LEFT JOIN (
    SELECT 
        event_id, 
        COUNT(*) as attendee_count 
    FROM rsvps 
    WHERE status = 'going' 
    GROUP BY event_id
) r ON e.id = r.event_id;

CREATE VIEW user_event_stats AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    u.last_login,
    COUNT(r.id) as events_joined,
    COUNT(DISTINCT DATE(e.event_date)) as unique_event_days
FROM users u
LEFT JOIN rsvps r ON u.id = r.user_id AND r.status = 'going'
LEFT JOIN events e ON r.event_id = e.id
GROUP BY u.id, u.name, u.email, u.last_login;

-- Create view for active sessions
CREATE VIEW active_user_sessions AS
SELECT 
    s.*,
    u.name as user_name,
    u.email as user_email
FROM user_sessions s
JOIN users u ON s.user_id = u.id
WHERE s.expires_at > NOW();

-- Stored procedures for authentication

DELIMITER //

-- Procedure to create a new user
CREATE PROCEDURE CreateUser(
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_salt VARCHAR(255)
)
BEGIN
    DECLARE user_exists INT DEFAULT 0;
    DECLARE new_user_id VARCHAR(36);
    
    -- Check if user already exists
    SELECT COUNT(*) INTO user_exists FROM users WHERE email = p_email;
    
    IF user_exists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User with this email already exists';
    ELSE
        SET new_user_id = UUID();
        
        INSERT INTO users (id, name, email, password_hash, salt)
        VALUES (new_user_id, p_name, p_email, p_password_hash, p_salt);
        
        -- Create welcome notification
        INSERT INTO notifications (user_id, type, title, message)
        VALUES (new_user_id, 'welcome', 'Welcome to Tech Events Hub!', 
                'Welcome to our community! Start exploring amazing tech events and connect with fellow innovators.');
        
        SELECT new_user_id as user_id, 'User created successfully' as message;
    END IF;
END //

-- Procedure to authenticate user
CREATE PROCEDURE AuthenticateUser(
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT
)
BEGIN
    DECLARE user_id_found VARCHAR(36) DEFAULT NULL;
    DECLARE stored_password_hash VARCHAR(255) DEFAULT NULL;
    DECLARE user_locked_until TIMESTAMP DEFAULT NULL;
    DECLARE current_attempts INT DEFAULT 0;
    
    -- Get user details
    SELECT id, password_hash, locked_until, login_attempts 
    INTO user_id_found, stored_password_hash, user_locked_until, current_attempts
    FROM users 
    WHERE email = p_email;
    
    -- Check if user exists
    IF user_id_found IS NULL THEN
        -- Log failed attempt
        INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
        VALUES (p_email, p_ip_address, p_user_agent, FALSE, 'User not found');
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email or password';
    END IF;
    
    -- Check if account is locked
    IF user_locked_until IS NOT NULL AND user_locked_until > NOW() THEN
        INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
        VALUES (p_email, p_ip_address, p_user_agent, FALSE, 'Account locked');
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account is temporarily locked. Please try again later.';
    END IF;
    
    -- Check password
    IF stored_password_hash = p_password_hash THEN
        -- Successful login
        UPDATE users 
        SET last_login = NOW(), login_attempts = 0, locked_until = NULL
        WHERE id = user_id_found;
        
        INSERT INTO login_attempts (email, ip_address, user_agent, success)
        VALUES (p_email, p_ip_address, p_user_agent, TRUE);
        
        SELECT user_id_found as user_id, 'Login successful' as message;
    ELSE
        -- Failed login
        SET current_attempts = current_attempts + 1;
        
        IF current_attempts >= 5 THEN
            -- Lock account for 30 minutes
            UPDATE users 
            SET login_attempts = current_attempts, locked_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE)
            WHERE id = user_id_found;
            
            INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
            VALUES (p_email, p_ip_address, p_user_agent, FALSE, 'Account locked after 5 attempts');
            
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account locked due to too many failed attempts. Please try again in 30 minutes.';
        ELSE
            UPDATE users 
            SET login_attempts = current_attempts
            WHERE id = user_id_found;
            
            INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
            VALUES (p_email, p_ip_address, p_user_agent, FALSE, 'Invalid password');
            
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email or password';
        END IF;
    END IF;
END //

DELIMITER ;

COMMIT;
