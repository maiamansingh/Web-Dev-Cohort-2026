# 1 Million Checkboxes - Real-Time Web App

A real-time web application where users can interact with a large grid of checkboxes. This project is inspired by the "1 Million Checkboxes" idea and built from scratch with custom real-time coordination, rate limiting, and authentication.

## Project Overview

The goal of this project is to handle a massive grid of checkboxes where state changes are reflected in real-time across all connected clients. It's not just about rendering boxes; it's about handling scale, managing socket connections efficiently, and making sure the backend doesn't crash under load.

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript (keeps things lightweight for rendering lots of DOM elements)
- **Backend**: Node.js with Express
- **Real-Time Communication**: WebSockets (using Socket.IO)
- **State & Pub/Sub**: Redis
- **Auth**: OIDC / OAuth 2.0 based authentication

## Features Implemented

- Huge interactive frontend checkbox grid.
- Real-time updates across multiple clients via WebSockets.
- Redis-based state coordination to store the state of checked boxes efficiently.
- Redis Pub/Sub integration to support multiple backend instances.
- Custom rate-limiting logic (built from scratch using Redis/memory counters) to prevent spamming.
- OIDC/OAuth 2.0 Authentication. Logged-in users can toggle checkboxes, while anonymous users get read-only access.
- Proper handling of connect/disconnect socket events and initial state sync on page load.

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=3000
REDIS_URL=redis://localhost:6379
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback
SESSION_SECRET=your_session_secret
```

## How to Run Locally

1. Clone the repository.
2. Make sure you have Node.js and Redis installed on your machine.
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Start your local Redis server.
5. Start the backend server:
   ```bash
   node index.js
   ```
6. Open your browser and go to `http://localhost:3000`.

## Redis Setup

Make sure Redis is running locally on port 6379. 
- For Mac: `brew services start redis`
- For Linux: `sudo systemctl start redis`
- For Windows: You can use WSL or a Docker container (`docker run -d -p 6379:6379 redis`).

## How It Works Under the Hood

### Auth Flow
I integrated an OIDC/OAuth 2.0 server. When a user clicks login, they are redirected to the auth provider. After successful authentication, a session is created. Socket actions (like toggling a checkbox) check the user's session. Unauthenticated users are served the grid in a read-only mode and their socket emit events are rejected by the server.

### WebSocket Flow
When a user connects, the server reads the current state of checked boxes from Redis and sends an `initial-state` event. When a user toggles a checkbox, an `update` event is emitted to the server. The server verifies the user's auth and rate limit, updates Redis, and then broadcasts this change to all other connected clients so their grid updates instantly.

### Redis & Pub/Sub
To handle 1 million checkboxes, storing the state in memory on a single Node instance isn't scalable. I used Redis to store the active states (using Sets or Bitmaps for compactness). Redis Pub/Sub is used so that if we spin up multiple backend servers, an update on Server A is published to Redis and Server B receives it to broadcast to its connected WebSocket clients.

### Custom Rate Limiting
Instead of using `express-rate-limit`, I implemented my own rate limiter to prevent abuse. 
It uses a sliding/fixed window approach. When a socket event or HTTP request comes in, the server checks a counter associated with the user's IP or User ID in Redis. If the counter exceeds the allowed limit within a specific timeframe (e.g., 50 clicks per 10 seconds), subsequent requests are dropped or ignored until the window expires.

## Demo Video & Live Link

- **Live URL**: [Add your live link here]
- **Demo Video**: [Add your YouTube unlisted link here]
