# Event Hype Scorer

**Find out how hot a show really is before you buy.**

Live demo → [event-hype-scorer.fly.dev](https://event-hype-scorer.fly.dev)

---

## What It Does

Event Hype Scorer lets fans search any artist or team and instantly see how much demand surrounds their upcoming events before committing to a ticket purchase.

Each event gets scored across four demand tiers based on SeatGeek's real-time event-level popularity data:

| Badge | Meaning |
|---|---|
| 🔥 High Demand | Very popular, event is coming up soon. Buy now |
| ⚡ Hot Event | Strong demand, worth moving on quickly |
| ⏰ Selling Fast | Moderate-to-high demand with the event approaching |
| 👀 Popular | Solid interest, some time to decide |
| 📅 Early Listing | Event is far out. Prices likely to drop closer to the date |
| 🎟 Moderate Interest | Lower demand, less urgency to buy |

---

## Why I Built This

I love live events: concerts, NBA games, the energy of being in a crowd with people who care about the same thing you do. I built this because I wanted to understand what SeatGeek's data actually reveals about fan demand, and because I believe fans deserve better signal than just a ticket price when deciding whether to buy now or wait.

This project started as a price comparison tool, but when I discovered pricing data isn't available on the public API tier, I pivoted to building something around SeatGeek's event-level popularity signal instead, which turned out to be a more honest and interesting product anyway.

---

## Features

- Search any artist or team
- Real-time hype scoring powered by SeatGeek's `event.popularity` field
- Skeleton loading cards while results fetch
- Clean empty and error states
- Demand progress bar per event
- Days-until-event countdown
- Fully responsive, dark-themed UI
- Deployed on Fly.io with no cold-start delay

---

## Tech Stack

**Frontend**
- HTML, CSS, Vanilla JavaScript

**Backend**
- Node.js / Express.js
- SeatGeek Public API

**Deployment**
- Fly.io (always-on, no cold start)

---

## Running Locally

### Prerequisites
- Node.js v18 or higher
- A SeatGeek API Client ID (see below)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/EventHypeScorer.git
cd EventHypeScorer

# 2. Install dependencies
cd server
npm install

# 3. Set up your environment variables
cp .env.example .env
# Open .env and add your SeatGeek Client ID

# 4. Start the server
node server.js
```

Then open `http://localhost:8080` in your browser.

### Getting a SeatGeek Client ID

1. Visit [seatgeek.com/build](https://seatgeek.com/build)
2. Register a new app (only a name is required, no redirect URI needed for this project)
3. Copy your `client_id` into the `.env` file

If you run into issues with account registration, you can reach the SeatGeek platform team at `tech-architecture@seatgeek.com`.

---

## Project Structure

```
EventHypeScorer/
├── client/
│   └── public/
│       ├── index.html
│       ├── index.js
│       └── styles.css
├── server/
│   ├── routes/
│   │   └── eventRoute.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── Dockerfile
├── fly.toml
└── README.md
```

---

## Known Limitations

- Pricing data (`stats.lowest_price`, `stats.average_price`) is not available on the public API tier. Hype scoring is based on demand signal, not ticket price
- Popularity data is most reliable for established, well-known acts; newer or very niche performers may return limited signal
- Results are limited to 10 events per search (SeatGeek's default `per_page` value)

---
