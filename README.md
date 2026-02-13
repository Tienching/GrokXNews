# GrokXNews

AI-driven intelligent task automation platform. Let AI proactively track hotspots and deliver organized information to you -- shifting from "you ask, I answer" to "proactive reporting."

## Overview

GrokXNews is a web-based platform that leverages Grok AI to automate recurring tasks such as news monitoring, trend analysis, content curation, and more. Users can create scheduled tasks with custom prompts, and results are automatically delivered via email or in-app notifications.

### Key Features

- **Scheduled Automation** -- Daily, weekly, monthly task execution with cron expression support. Set it and forget it.
- **Email Push Notifications** -- Results delivered directly to your inbox. No need to open the app.
- **X (Twitter) Deep Integration** -- Real-time tracking of hashtags, user accounts, trending topics, and sentiment analysis powered by Grok's native X platform access.
- **Smart Task Templates** -- Pre-built templates for content creation, market research, investment tracking, tech trends, and more.
- **Execution History** -- Full history of task runs and AI-generated content, searchable and exportable.
- **AI Prompt Optimization** -- Built-in AI-assisted prompt refinement to improve output quality.

## Project Structure

```
GrokXNews/
├── index.html          # Main landing page (Chinese)
├── styles.css          # Global stylesheet
├── script.js           # Client-side JavaScript (form handling, UI interactions)
├── favicon.svg         # Site favicon
├── README.md           # This file
└── zh/                 # Chinese language pages
    ├── grok-tasks.html # Task management page
    ├── showcase.html   # Task execution showcase
    ├── pricing.html    # Pricing plans
    ├── docs.html       # Documentation
    ├── api-docs.html   # API documentation
    ├── posts.html      # Blog posts
    ├── help.html       # Help center
    ├── contact.html    # Contact page
    ├── signin.html     # Sign in page
    └── signup.html     # Sign up page
```

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (no framework dependencies)
- **Styling**: CSS custom properties (variables), responsive design with mobile-first approach
- **UI**: Custom component system with grid layouts, accordion FAQ, smooth scroll navigation
- **AI Backend**: Grok AI (via X/xAI platform)

## Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:Tienching/GrokXNews.git
   cd GrokXNews
   ```

2. Open `index.html` in your browser, or serve with any static file server:
   ```bash
   # Using Python
   python3 -m http.server 8080

   # Using Node.js
   npx serve .
   ```

3. Visit `http://localhost:8080` in your browser.

## Pricing

| Plan | Price | Credits | Notes |
|------|-------|---------|-------|
| Free | 0 | 3/day | Core features, community support |
| Starter | 15 CNY | 50 | One-time purchase, never expires |
| Standard | 49 CNY | 200 | One-time purchase, email notifications |

## Use Cases

- **Daily News Digest** -- Automatically gather and summarize news from specific topics every morning.
- **Social Media Monitoring** -- Track influencer posts and trending discussions on X (Twitter).
- **Investment Tracking** -- Monitor stock market trends, financial reports, and investment signals.
- **Tech Trends** -- Follow GitHub Trending, AI industry updates, and developer community discussions.
- **Content Creation** -- Generate daily/weekly reports, newsletters, and content summaries.

## Links

- Website: [grokx.news](https://grokx.news)
- Product Hunt: [GrokXNews](https://www.producthunt.com/products/grok-taskpro)
- Twitter: [@Nikitka_aktikiN](https://x.com/Nikitka_aktikiN)

## License

All rights reserved. (c) 2025 GrokXNews.
