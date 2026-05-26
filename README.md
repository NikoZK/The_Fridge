# The Fridge

The Fridge is my Node.js exam project. It is a small full-stack web app for keeping track of items in a shared fridge.

Users can create an account, log in, see fridge items, add new items, update quantities, mark items as needed, and delete items. There is also a small dinner page that uses sockets so logged-in users can post dinner ideas in real time.

It is made without AI, which might be pretty obvious by looking at the styling.

## Tech Stack

- Node.js
- Express
- SQLite
- Svelte
- Socket.IO
- Sessions
- Bcrypt
- Nodemailer

## Features

- User signup and login
- Passwords are hashed before being stored
- Session-based authentication
- Protected frontend routes
- Protected backend routes for creating, updating, and deleting fridge items
- Public route for reading fridge items
- Account deletion
- Privacy policy page
- Real-time dinner ideas with Sockets
- Welcome email preview with Ethereal/Nodemailer

## How To Run

First install dependencies in both folders:

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

Create a `.env` file in the `server` folder:

```env
SESSION_SECRET=your_secret_here
```

Create and seed the database:

```bash
node database/createDatabase.js --delete
```

Start the server:

```bash
npm start
```

The server builds the Svelte frontend and then starts the Express app.

## Local Development

For development, the frontend can be run with Vite:

```bash
cd client
npm run dev
```

And for backend:

```bash
cd server
npx nodemon app.js
```

The backend runs on port `8080`.

## Notes

The project uses SQLite, so the database is stored locally in the server folder. The email feature uses Ethereal test accounts, so it opens a preview email instead of sending a real production email.
