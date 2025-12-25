-- User Notifications Table
-- Run this SQL to create the notifications table for users

CREATE TABLE IF NOT EXISTS user_notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'gallery', 'workshop', 'event', 'blog', 'announcement'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT, -- Optional link to the new content
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at DESC);

-- Sample query to verify
SELECT * FROM user_notifications ORDER BY created_at DESC LIMIT 10;
