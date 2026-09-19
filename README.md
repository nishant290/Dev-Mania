# Dev-Mania

> A "social network" web-app for developers !!

Dev-Mania is a social platform built for developers to connect, share, and grow together — think profiles, posts, and a feed, but tailored to the dev community.

---

## Project Structure

```
Dev-Mania/
├── client/          # Frontend application
├── server/          # Backend API / server
├── .github/         # GitHub configuration (workflows, templates, etc.)
└── package-lock.json
```

The project is split into a `client` and a `server`, each with its own dependencies and scripts — a typical decoupled frontend/backend setup.

## Features

- Developer profiles
- Social feed / posts
- Connect with other developers
- *(Add or refine this list to match what's actually implemented — see note below)*

## Tech Stack

> This repo separates concerns into `client/` and `server/` directories. Fill in the specifics below to match your actual stack (e.g. React/Next.js on the client, Node.js/Express on the server, MongoDB/PostgreSQL for the database, etc.):

- **Frontend:** _e.g. React, Next.js, Tailwind CSS_
- **Backend:** _e.g. Node.js, Express_
- **Database:** _e.g. MongoDB, PostgreSQL_
- **Auth:** _e.g. JWT, OAuth_

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm or yarn
- A running database instance (if applicable)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/nishant290/Dev-Mania.git
   cd Dev-Mania
   ```

2. Install server dependencies
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create a `.env` file inside the `server` (and `client`, if needed) directory with values such as:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
```

### Running the App

Start the backend:
```bash
cd server
npm start
```

Start the frontend (in a separate terminal):
```bash
cd client
npm start
```

The client will typically run on `http://localhost:3000` and the server on `http://localhost:5000` (adjust to your actual configuration).

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Nishant** — [@nishant290](https://github.com/nishant290)

---

*Star this repo if you find it useful!*
