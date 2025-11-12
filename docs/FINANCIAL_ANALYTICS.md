# Financial Analytics Dashboard

## Overview
Admin-only financial analytics system for tracking event profitability, budgets, and ticket sales with real-time charts and comprehensive CRUD operations.

## Features

### 📊 Analytics & Reporting
- **Monthly/Yearly Profit Trends**: Filter by year and month to view profit summaries
- **Event-wise Breakdown**: Compare profitability across all events
- **Ticket Sales Distribution**: Visualize ticket sales per event with pie charts
- **Budget Analysis**: Compare income vs investment for each event

### 💰 Financial Records Management
- **Full CRUD Operations**: Create, Read, Update, Delete financial records
- **Auto-populated Event Data**: Event date auto-fills when selecting an event
- **Comprehensive Cost Tracking**:
  - Tickets Sold
  - Income (Total Revenue)
  - Event Expense
  - Material Cost
  - Marketing Cost
  - Auto-calculated: Total Investment & Total Profit

### 🎨 Visual Charts (MUI X Charts)
1. **Bar Chart**: Event-wise profit comparison
2. **Line Chart**: Monthly profit trend over time
3. **Pie Chart**: Ticket sales distribution
4. **Grouped Bar Chart**: Income vs Investment analysis

## Access
- **Route**: `/admin/financials`
- **Auth**: Admin token required (redirects to `/admin/login` if unauthorized)
- **Navigation**: Available from Admin Portal as "Financial Analytics" module

## Database Schema
Located in `scripts/event_financials_schema.sql`

### Table: event_financials
```sql
- id (BIGSERIAL PRIMARY KEY)
- event_id (TEXT, references events.id)
- ticket_sold (INTEGER)
- income (NUMERIC)
- event_expense (NUMERIC)
- material_cost (NUMERIC)
- marketing_cost (NUMERIC)
- created_at, updated_at (TIMESTAMP)
```

### Views
- `v_event_profit_monthly`: Monthly profit aggregates
- `v_event_profit_yearly`: Yearly profit aggregates

## API Endpoints

All endpoints require admin authentication (`Authorization: Bearer <token>`)

### List Financial Records
```
GET /admin/financials?year=2025&month=11&event_id=<id>&page=1&limit=100
```

### Create Record
```
POST /admin/financials
Body: {
  event_id: "string",
  ticket_sold: number,
  income: number,
  event_expense: number,
  material_cost: number,
  marketing_cost: number
}
```

### Update Record
```
PUT /admin/financials/:id
Body: { ...fields to update }
```

### Delete Record
```
DELETE /admin/financials/:id
```

### Monthly Summary
```
GET /admin/financials/summary/monthly?year=2025
Returns: [{ month: 1-12, total_profit: number }]
```

### Yearly Summary
```
GET /admin/financials/summary/yearly
Returns: [{ year: number, total_profit: number }]
```

### Analytics Dataset
```
GET /admin/financials/analytics
Returns: {
  eventProfits: [...],
  monthlyTrend: [...],
  ticketDistribution: [...]
}
```

## Setup Instructions

### 1. Apply Database Schema
Run in your Neon SQL console:
```sql
-- If event_financials already exists with wrong type:
ALTER TABLE event_financials ALTER COLUMN event_id TYPE TEXT USING event_id::text;

-- Otherwise, run the full schema:
\i scripts/event_financials_schema.sql
```

### 2. Seed Test Data (Optional)
```sql
-- Get an event ID first
SELECT id, title FROM events LIMIT 1;

-- Insert test record
INSERT INTO event_financials (event_id, ticket_sold, income, event_expense, material_cost, marketing_cost)
VALUES ('<event-id>', 100, 50000, 20000, 5000, 3000);
```

### 3. Deploy Backend
Ensure the updated Worker bundle is deployed to Cloudflare:
```bash
wrangler publish
```

### 4. Access Dashboard
Navigate to `/admin/financials` and log in with admin credentials.

## Theme Colors
Matches existing admin portal theme:
- Gold: `#c38f21`
- Gold Light: `#d4af85`
- Dark Background: `#002f2f`
- Card Background: `#073838`
- Text: `#e0e0e0`

## Components Used
- MUI Material UI (Cards, Tables, Forms, Buttons)
- MUI X Charts (BarChart, LineChart, PieChart)
- Admin Header & Footer
- Video Logo
- Admin Loading

## Client API
Located in `src/lib/adminApi.js`:
```javascript
import { financialsApi } from '../../lib/adminApi';

// Usage examples
await financialsApi.list({ year: 2025, month: 11 });
await financialsApi.create({ event_id: "123", income: 50000, ... });
await financialsApi.update(recordId, updates);
await financialsApi.remove(recordId);
await financialsApi.monthlySummary(2025);
await financialsApi.yearlySummary();
await financialsApi.analytics();
```

## Notes
- All monetary values stored as NUMERIC(12,2) for precision
- Profit calculation: `income - (event_expense + material_cost + marketing_cost)`
- Charts auto-update when filters change or records are modified
- Empty states show helpful messages when no data is available
- Table shows color-coded profit (green=positive, red=negative)

## Troubleshooting

### 500 Error on Load
1. Check if `event_financials` table exists in Neon
2. Verify `event_id` column is TEXT (not BIGINT)
3. Check browser console for detailed error messages
4. Ensure Worker is deployed with latest code

### Charts Not Showing
- Add at least one financial record
- Verify filters match existing data
- Check that events have valid start_date values

### Edit/Delete Not Working
- Confirm adminToken is valid in localStorage
- Check Network tab for API response errors
- Verify record ID exists in database
