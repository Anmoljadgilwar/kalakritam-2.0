-- Event Financials Schema for Neon (PostgreSQL)
-- Creates table, indexes, and useful views for monthly/yearly profit

CREATE TABLE IF NOT EXISTS event_financials (
  id BIGSERIAL PRIMARY KEY,
  -- Store event_id as TEXT to match existing events.id type
  event_id TEXT NOT NULL,
  ticket_sold INTEGER NOT NULL DEFAULT 0,
  income NUMERIC(12,2) NOT NULL DEFAULT 0,
  event_expense NUMERIC(12,2) NOT NULL DEFAULT 0,
  material_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  marketing_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Optional FK (uncomment if events.id is BIGINT)
-- ALTER TABLE event_financials
--   ADD CONSTRAINT fk_event_financials_event
--   FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_event_financials_event_id ON event_financials(event_id);
CREATE INDEX IF NOT EXISTS idx_event_financials_created_at ON event_financials(created_at);

-- Monthly profit view
CREATE OR REPLACE VIEW v_event_profit_monthly AS
SELECT 
  EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at))::int AS year,
  EXTRACT(MONTH FROM COALESCE(e.start_date, ef.created_at))::int AS month,
  SUM(ef.income - (ef.event_expense + ef.material_cost + ef.marketing_cost))::numeric AS total_profit
FROM event_financials ef
LEFT JOIN events e ON e.id::text = ef.event_id::text
GROUP BY year, month
ORDER BY year, month;

-- Yearly profit view
CREATE OR REPLACE VIEW v_event_profit_yearly AS
SELECT 
  EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at))::int AS year,
  SUM(ef.income - (ef.event_expense + ef.material_cost + ef.marketing_cost))::numeric AS total_profit
FROM event_financials ef
LEFT JOIN events e ON e.id::text = ef.event_id::text
GROUP BY year
ORDER BY year;

-- Migration helper (run manually if you created event_financials with BIGINT event_id):
-- ALTER TABLE event_financials ALTER COLUMN event_id TYPE TEXT USING event_id::text;