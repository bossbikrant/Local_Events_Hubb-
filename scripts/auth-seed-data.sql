-- Enhanced seed data with proper authentication
-- Local Events Hub - Tech & Startup Theme

USE local_events_hub;

-- Insert demo users with proper password hashing
-- Note: In production, use proper bcrypt hashing with salt
INSERT INTO users (id, name, email, password_hash, salt, bio, interests, email_verified) VALUES
('demo-user-001', 'Demo User', 'demo@techevents.com', 
 SHA2(CONCAT('demo123', 'demo_salt_001'), 256), 'demo_salt_001',
 'Demo user for testing the Tech Events Hub application', 
 '["Demo", "Testing", "Tech Events"]', TRUE),

('user-001', 'Alex Developer', 'alex@techevents.com', 
 SHA2(CONCAT('password123', 'salt_001'), 256), 'salt_001',
 'Full-stack developer passionate about emerging technologies', 
 '["React", "Node.js", "AI/ML", "Blockchain"]', TRUE),

('user-002', 'Sarah Chen', 'sarah.chen@startup.io', 
 SHA2(CONCAT('password123', 'salt_002'), 256), 'salt_002',
 'Product manager and startup enthusiast', 
 '["Product Management", "UX Design", "Startups", "Agile"]', TRUE),

('user-003', 'Mike Rodriguez', 'mike.r@devcorp.com', 
 SHA2(CONCAT('password123', 'salt_003'), 256), 'salt_003',
 'Senior software engineer with 8+ years experience', 
 '["Python", "Machine Learning", "DevOps", "Cloud Computing"]', TRUE),

('user-004', 'Emma Thompson', 'emma@fintech.co', 
 SHA2(CONCAT('password123', 'salt_004'), 256), 'salt_004',
 'Fintech entrepreneur and angel investor', 
 '["Fintech", "Investment", "Blockchain", "Entrepreneurship"]', TRUE),

('user-005', 'David Kim', 'david.kim@mobile.dev', 
 SHA2(CONCAT('password123', 'salt_005'), 256), 'salt_005',
 'Mobile app developer specializing in React Native', 
 '["React Native", "Mobile Development", "iOS", "Android"]', TRUE);

-- Insert sample events (unchanged from previous version)
INSERT INTO events (id, title, description, event_date, event_time, location, category, organizer, max_attendees, image_url, tags) VALUES
('event-001', 'AI/ML Hackathon 2024', 'Join us for a 48-hour hackathon focused on artificial intelligence and machine learning solutions. Build innovative projects and compete for amazing prizes! Teams will work on real-world problems using cutting-edge AI technologies.', '2024-02-15', '09:00:00', 'Tech Hub, Level 3, 123 Innovation St', 'Hackathon', 'TechCorp', 100, '/placeholder.svg?height=200&width=300', '["AI", "Machine Learning", "Python", "Competition", "Innovation"]'),

('event-002', 'Startup Pitch Night', 'Watch emerging startups pitch their ideas to investors and industry experts. Network with entrepreneurs and learn about the latest trends in the startup ecosystem. Featured investors from top VC firms will be present.', '2024-02-20', '18:30:00', 'Innovation Center Auditorium', 'Networking', 'Startup Alliance', 150, '/placeholder.svg?height=200&width=300', '["Startups", "Pitching", "Investors", "Networking", "Entrepreneurship"]'),

('event-003', 'React Native Workshop', 'Learn to build cross-platform mobile apps with React Native. Hands-on workshop covering navigation, state management, and API integration. Perfect for developers looking to expand their mobile development skills.', '2024-02-25', '10:00:00', 'Code Academy, Room 201', 'Workshop', 'Mobile Dev Community', 50, '/placeholder.svg?height=200&width=300', '["React Native", "Mobile Development", "JavaScript", "Workshop", "Cross-platform"]'),

('event-004', 'Blockchain & Web3 Meetup', 'Explore the future of decentralized applications and blockchain technology. Featuring talks from industry leaders and hands-on demos of the latest Web3 tools and frameworks.', '2024-03-01', '19:00:00', 'Crypto Lounge, Downtown', 'Meetup', 'Web3 Collective', 80, '/placeholder.svg?height=200&width=300', '["Blockchain", "Web3", "Cryptocurrency", "DeFi", "Smart Contracts"]'),

('event-005', 'DevOps & Cloud Computing Summit', 'A comprehensive summit covering the latest in DevOps practices and cloud computing technologies. Learn about containerization, CI/CD pipelines, and cloud-native architectures.', '2024-03-05', '09:00:00', 'Convention Center, Hall A', 'Conference', 'Cloud Native Foundation', 200, '/placeholder.svg?height=200&width=300', '["DevOps", "Cloud Computing", "Docker", "Kubernetes", "AWS"]'),

('event-006', 'Women in Tech Networking', 'An empowering networking event for women in technology. Connect with fellow professionals, share experiences, and learn about career advancement opportunities in the tech industry.', '2024-03-08', '17:00:00', 'Tech Diversity Center', 'Networking', 'Women in Tech Alliance', 75, '/placeholder.svg?height=200&width=300', '["Women in Tech", "Networking", "Career Development", "Diversity", "Inclusion"]'),

('event-007', 'Cybersecurity Workshop', 'Learn essential cybersecurity practices for modern applications. Hands-on workshop covering threat modeling, secure coding practices, and penetration testing fundamentals.', '2024-03-12', '13:00:00', 'Security Institute, Lab 1', 'Workshop', 'CyberSec Pro', 40, '/placeholder.svg?height=200&width=300', '["Cybersecurity", "Security", "Penetration Testing", "Secure Coding", "Workshop"]'),

('event-008', 'Startup Funding Masterclass', 'Learn the ins and outs of startup funding from seed to Series A. Featuring successful entrepreneurs and VCs sharing their experiences and insights on raising capital.', '2024-03-15', '14:00:00', 'Business School Auditorium', 'Workshop', 'Entrepreneur Hub', 120, '/placeholder.svg?height=200&width=300', '["Startup Funding", "Venture Capital", "Entrepreneurship", "Investment", "Business"]');

-- Insert sample RSVPs
INSERT INTO rsvps (id, user_id, event_id, status) VALUES
('rsvp-001', 'user-001', 'event-002', 'going'),
('rsvp-002', 'user-001', 'event-003', 'going'),
('rsvp-003', 'user-002', 'event-001', 'going'),
('rsvp-004', 'user-002', 'event-002', 'going'),
('rsvp-005', 'user-002', 'event-006', 'going'),
('rsvp-006', 'user-003', 'event-001', 'going'),
('rsvp-007', 'user-003', 'event-004', 'going'),
('rsvp-008', 'user-003', 'event-005', 'going'),
('rsvp-009', 'user-004', 'event-002', 'going'),
('rsvp-010', 'user-004', 'event-008', 'going'),
('rsvp-011', 'user-005', 'event-003', 'going'),
('rsvp-012', 'user-005', 'event-005', 'going');

-- Insert sample comments
INSERT INTO comments (id, event_id, user_id, content) VALUES
('comment-001', 'event-001', 'user-002', 'Really excited for this hackathon! Anyone working on healthcare AI solutions?'),
('comment-002', 'event-001', 'user-003', 'Count me in! I have experience with TensorFlow and would love to collaborate.'),
('comment-003', 'event-002', 'user-004', 'Great lineup of startups this month. Looking forward to the fintech presentations!'),
('comment-004', 'event-003', 'user-001', 'Perfect timing! I have been wanting to learn React Native for months.'),
('comment-005', 'event-003', 'user-005', 'As someone who works with RN daily, happy to help newcomers during the workshop.'),
('comment-006', 'event-004', 'user-003', 'Web3 is the future! Excited to see what new projects are being built.'),
('comment-007', 'event-002', 'user-001', 'Will there be opportunities for one-on-one meetings with investors?'),
('comment-008', 'event-005', 'user-005', 'Cloud-native is essential for modern apps. Great topic choice!');

-- Insert welcome notifications for all users
INSERT INTO notifications (id, user_id, type, title, message) VALUES
('notif-welcome-001', 'demo-user-001', 'welcome', 'Welcome to Tech Events Hub!', 'Welcome to our community! Start exploring amazing tech events and connect with fellow innovators.'),
('notif-welcome-002', 'user-001', 'welcome', 'Welcome to Tech Events Hub!', 'Welcome to our community! Start exploring amazing tech events and connect with fellow innovators.'),
('notif-welcome-003', 'user-002', 'welcome', 'Welcome to Tech Events Hub!', 'Welcome to our community! Start exploring amazing tech events and connect with fellow innovators.'),
('notif-welcome-004', 'user-003', 'welcome', 'Welcome to Tech Events Hub!', 'Welcome to our community! Start exploring amazing tech events and connect with fellow innovators.'),
('notif-welcome-005', 'user-004', 'welcome', 'Welcome to Tech Events Hub!', 'Welcome to our community! Start exploring amazing tech events and connect with fellow innovators.'),
('notif-welcome-006', 'user-005', 'welcome', 'Welcome to Tech Events Hub!', 'Welcome to our community! Start exploring amazing tech events and connect with fellow innovators.');

-- Insert sample event notifications
INSERT INTO notifications (id, user_id, event_id, type, title, message) VALUES
('notif-001', 'user-001', 'event-002', 'event_reminder', 'Event Tomorrow', 'Startup Pitch Night is tomorrow at 6:30 PM. Don\'t forget to attend!'),
('notif-002', 'user-002', 'event-001', 'new_comment', 'New Comment', 'Mike Rodriguez commented on AI/ML Hackathon 2024'),
('notif-003', 'user-003', 'event-004', 'event_update', 'Event Updated', 'Blockchain & Web3 Meetup location has been updated'),
('notif-004', 'user-001', 'event-003', 'rsvp_confirmation', 'RSVP Confirmed', 'Your RSVP for React Native Workshop has been confirmed');

-- Insert some sample login attempts for demo purposes
INSERT INTO login_attempts (email, ip_address, user_agent, success) VALUES
('demo@techevents.com', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', TRUE),
('alex@techevents.com', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', TRUE),
('sarah.chen@startup.io', '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36', TRUE);

COMMIT;

-- Display summary of inserted data
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'RSVPs', COUNT(*) FROM rsvps
UNION ALL
SELECT 'Comments', COUNT(*) FROM comments
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Login Attempts', COUNT(*) FROM login_attempts;

-- Display demo account information
SELECT 
    'Demo Account Information' as info_type,
    'Email: demo@techevents.com, Password: demo123' as credentials
UNION ALL
SELECT 
    'Other Test Accounts',
    'All other accounts use password: password123';
