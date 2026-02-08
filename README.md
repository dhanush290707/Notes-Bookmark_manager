# Personal Notes & Bookmark Manager

A modern, full-stack notes and bookmarks management application built with Next.js 14 and MongoDB.

## Features

- 📝 **Notes Management** - Create, edit, delete notes with rich formatting
- 🔖 **Bookmark Management** - Save and organize bookmarks with auto-fetched metadata
- 🏷️ **Tags** - Organize content with custom tags
- ⭐ **Favorites** - Mark important items as favorites
- 🔍 **Search** - Full-text search across notes and bookmarks
- 🎨 **Modern UI** - Dark theme with glassmorphism design

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/notes-bookmark-manager.git
cd notes-bookmark-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/notes-bookmarks
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable in Vercel:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (required) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create note |
| GET | `/api/notes/:id` | Get note by ID |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/bookmarks` | Get all bookmarks |
| POST | `/api/bookmarks` | Create bookmark |
| GET | `/api/bookmarks/:id` | Get bookmark by ID |
| PUT | `/api/bookmarks/:id` | Update bookmark |
| DELETE | `/api/bookmarks/:id` | Delete bookmark |

## License

MIT
