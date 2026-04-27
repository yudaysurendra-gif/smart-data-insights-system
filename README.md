# Smart Data Insights System

A production-grade analytics dashboard with AI-powered insights, interactive charts, data exploration, and report generation.

## Project Structure

```
smart-data-insights/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styles (dark/light mode, responsive)
├── js/
│   ├── data.js         # Datasets, helpers, CSV parser
│   ├── charts.js       # Chart.js chart definitions
│   └── app.js          # Navigation, table, AI, export logic
├── data/
│   └── sample.csv      # Sample CSV for import testing
└── README.md
```

## Features

### 1. Overview Dashboard
- 4 animated KPI metric cards (Revenue, Users, Conversion, Session Time)
- Monthly revenue bar + trend line chart
- Traffic sources donut chart
- Top products and region breakdown with animated bars
- Plan distribution and weekly sessions charts

### 2. AI Insights
- 6 auto-generated insight cards (positive, alerts, opportunities, warnings)
- Natural language query box — type any question about your data
- Pre-built suggestion buttons for quick analysis
- Confidence scores and timestamps

### 3. Data Explorer
- Searchable, sortable, filterable table (20 accounts)
- Filter by status, plan, and region
- Health score bars with color coding
- Status badges (Active / At risk / Churned)
- Pagination support

### 4. Charts
- Quarterly revenue vs target (bar + line combo)
- User growth line chart
- Churn rate trend
- Revenue by region (stacked bar)

### 5. Reports
- 5 pre-built report types (Monthly, Revenue, User Behavior, Funnel, Churn)
- Download buttons
- Custom report generator (placeholder)

### 6. Other Features
- Dark / Light mode toggle
- CSV import with parser
- CSV export of full dataset
- Toast notifications
- Responsive layout
- Animated page transitions

## Setup

This is a pure HTML/CSS/JS project — **no build step required**.

### Option 1: Open directly
```bash
open index.html
```

### Option 2: Local server (recommended for CSV import)
```bash
# Python
python3 -m http.server 3000

# Node
npx serve .
```

Then visit: http://localhost:3000

## Extending the Project

### Add real data
Replace the arrays in `js/data.js` with your actual data, or use the CSV import feature to load data dynamically.

### Connect to an API
In `js/app.js`, replace the static ACCOUNTS array fetch with an actual API call:
```js
const res = await fetch('https://your-api.com/accounts');
const data = await res.json();
```

### Add more AI analysis
In `js/app.js`, replace the `AI_RESPONSES` object with a real LLM API call for dynamic responses.

## Tech Stack
- Vanilla HTML/CSS/JavaScript
- Chart.js 4.4.1 (CDN)
- Google Fonts: Sora + DM Mono
- No frameworks, no build tools
