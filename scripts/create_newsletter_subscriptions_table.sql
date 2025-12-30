-- ============================================
-- Newsletter Subscriptions Table
-- ============================================
-- This table stores newsletter subscription data
-- Run this script to create the table in your database

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscribed BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    confirmation_sent BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45) NULL,
    source VARCHAR(100) DEFAULT 'blog_page',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON newsletter_subscriptions(subscribed);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at);

-- Add comment to table
COMMENT ON TABLE newsletter_subscriptions IS 'Stores newsletter subscription data for the Kalakritam art blog';

-- Optional: Create a trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_newsletter_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_newsletter_subscriptions_updated_at ON newsletter_subscriptions;
CREATE TRIGGER trigger_newsletter_subscriptions_updated_at
    BEFORE UPDATE ON newsletter_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_subscriptions_updated_at();

-- ============================================
-- Sample Queries for Reference
-- ============================================

-- Get all active subscribers
-- SELECT * FROM newsletter_subscriptions WHERE subscribed = TRUE ORDER BY subscribed_at DESC;

-- Get subscriber count
-- SELECT COUNT(*) as total_subscribers FROM newsletter_subscriptions WHERE subscribed = TRUE;

-- Unsubscribe a user
-- UPDATE newsletter_subscriptions SET subscribed = FALSE, unsubscribed_at = CURRENT_TIMESTAMP WHERE email = 'user@example.com';

-- Check if email is subscribed
-- SELECT * FROM newsletter_subscriptions WHERE email = 'user@example.com' AND subscribed = TRUE;
