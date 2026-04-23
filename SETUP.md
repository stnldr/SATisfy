# StudySAT Fullstack Setup Guide

This guide will help you set up the fullstack SAT preparation website with Supabase backend.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier is sufficient)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `studysat` (or any name you prefer)
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys > anon/public)
   - **service_role key** (under Project API keys > service_role) - Keep this secret!

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

2. Replace the values with your actual Supabase credentials

## Step 4: Run Database Migrations

1. Make sure you have the Supabase CLI installed:
   ```bash
   npm install -g supabase
   ```

2. Link your project (optional - if using Supabase CLI):
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run migrations:
   - If using Supabase CLI: `supabase db push`
   - Or manually copy and run the SQL from `supabase/migrations/20240101000000_create_sat_schema.sql` and `supabase/migrations/20240101000001_create_stats_update_function.sql` in your Supabase SQL Editor

   To run manually:
   1. Go to your Supabase project dashboard
   2. Navigate to **SQL Editor**
   3. Create a new query
   4. Copy the contents of `supabase/migrations/20240101000000_create_sat_schema.sql`
   5. Click "Run"
   6. Repeat for `supabase/migrations/20240101000001_create_stats_update_function.sql`

## Step 5: Seed the Database

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the seed script:
   ```bash
   node scripts/seed-database.js
   ```

   This will populate the database with:
   - 60+ SAT practice questions
   - 18 lessons covering Reading, Math, Grammar, and Strategy
   - 28 flashcards for vocabulary and concepts

## Step 6: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Step 7: Test the Application

1. Open the app in your browser
2. Try signing up for a new account
3. Take a practice quiz - your progress should be saved to Supabase
4. Check your Supabase dashboard to see data being saved in real-time:
   - Go to **Table Editor** to see `user_progress`, `user_bookmarks`, etc.

## Database Schema Overview

The database includes the following tables:

- **questions**: SAT practice questions with sections, difficulty levels, and explanations
- **lessons**: Educational lessons organized by category
- **flashcards**: Vocabulary and concept flashcards
- **user_progress**: Tracks user quiz attempts and performance
- **user_bookmarks**: User-saved questions for later review
- **user_stats**: Aggregated statistics per user (auto-updated via triggers)
- **flashcard_progress**: Spaced repetition system progress for flashcards

All user data is protected by Row Level Security (RLS) policies, ensuring users can only access their own data.

## Troubleshooting

### "Missing environment variables" error
- Make sure your `.env` file exists in the project root
- Check that variable names start with `VITE_` for client-side variables
- Restart your dev server after adding environment variables

### Database connection errors
- Verify your Supabase URL and keys are correct
- Check that your Supabase project is active (not paused)
- Ensure migrations have been run successfully

### "Relation does not exist" errors
- Make sure you've run all migration files
- Check the Supabase SQL Editor for any errors during migration

### Seed script fails
- Ensure you're using the service_role key (not the anon key)
- Check that tables exist by running migrations first
- Verify your Supabase project is accessible

## Next Steps

- Customize questions and lessons in `src/data/database.ts`
- Add more features like full-length practice tests
- Implement leaderboards and achievements
- Add social features for study groups

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your preferred hosting platform (Vercel, Netlify, etc.)
3. Make sure to set environment variables in your hosting platform
4. Update Supabase project settings for production URL if needed

## Support

For issues or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the [React Query Documentation](https://tanstack.com/query/latest)
- Check project issues on GitHub






