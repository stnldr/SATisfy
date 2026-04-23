# StudySAT - Fullstack SAT Preparation Website

A comprehensive fullstack web application for SAT exam preparation with practice questions, lessons, flashcards, and progress tracking.

## 🚀 Features

- **Practice Questions**: 60+ SAT questions across Reading, Math, and Grammar sections
- **Lessons**: 18 comprehensive lessons covering all SAT topics and strategies
- **Flashcards**: 28 vocabulary and concept flashcards
- **Progress Tracking**: Track your performance with detailed statistics
- **Bookmarks**: Save questions for later review
- **User Authentication**: Secure user accounts with Supabase Auth
- **Cloud Sync**: All your progress synced across devices
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **React Query (TanStack Query)** for data fetching and caching

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** for user authentication
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** (ready for future features)

## 📁 Project Structure

```
studysat/
├── src/
│   ├── components/         # React components
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── data/              # Static data (questions, lessons, flashcards)
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Supabase client setup
│   ├── lib/               # Utility functions
│   │   ├── supabase/      # Supabase service functions
│   │   └── storage.ts     # localStorage utilities (fallback)
│   └── pages/             # Page components
├── supabase/
│   └── migrations/        # Database migration files
└── scripts/               # Utility scripts
```

## 🔧 Setup Instructions

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Get your project URL and API keys

3. **Configure environment**
   Create `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   ```

4. **Run database migrations**
   - Go to Supabase SQL Editor
   - Run migrations from `supabase/migrations/`

5. **Seed database**
   - Copy questions/lessons/flashcards from `src/data/database.ts`
   - Create INSERT statements (or use SQL editor)

6. **Start development server**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Tables
- `questions` - Practice questions
- `lessons` - Educational lessons
- `flashcards` - Vocabulary cards
- `user_progress` - Quiz attempt history
- `user_bookmarks` - Saved questions
- `user_stats` - Aggregated statistics
- `flashcard_progress` - Spaced repetition data

See [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md) for detailed schema documentation.

## 🔐 Authentication

The app supports:
- Email/password registration
- Email/password login
- Password reset
- Session management
- Protected routes

## 💾 Data Storage

### For Authenticated Users
- All data stored in Supabase PostgreSQL
- Automatic cloud sync
- Accessible from any device
- Secure with RLS policies

### For Unauthenticated Users
- Data stored in localStorage
- Local-only, not synced
- Automatically migrates to Supabase on signup

## 🎯 Key Features Explained

### Practice Mode
- Filter by section (Reading, Math, Grammar)
- Filter by difficulty (Easy, Medium, Hard)
- Instant feedback with explanations
- Progress tracking per question

### Statistics
- Total attempts and accuracy
- Performance by section
- Historical progress
- Visual charts and graphs

### Bookmarks
- Save questions for review
- Quick access from home page
- Organized by section/difficulty

## 📝 Development

### Adding New Questions

Questions are stored in the database. To add:
1. Insert into `questions` table via Supabase dashboard
2. Or create a migration with INSERT statements
3. Or use the Supabase API

### Adding New Lessons

Similar to questions, add to `lessons` table.

### Customization

- **Theming**: Modify `tailwind.config.ts`
- **Components**: Edit files in `src/components/ui/`
- **Routing**: Update `src/App.tsx`
- **Styles**: Modify `src/index.css`

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel/Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables
4. Deploy!

### Environment Variables in Production

Make sure to set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup guide
- [FULLSTACK_SETUP.md](./FULLSTACK_SETUP.md) - Architecture and technical details
- [AUTH_README.md](./AUTH_README.md) - Authentication system documentation

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Supabase for the amazing backend platform
- shadcn for the beautiful UI components
- The SAT prep community for feedback and suggestions

## 🆘 Support

For issues or questions:
1. Check the documentation files
2. Review Supabase documentation
3. Open an issue on GitHub

---

**Happy studying! 📚✨**






