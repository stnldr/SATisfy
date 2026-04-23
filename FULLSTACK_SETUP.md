# StudySAT Fullstack Implementation

This document describes the fullstack implementation of the StudySAT application.

## Architecture Overview

The application is now a fullstack web application with:

- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Authentication + Real-time)
- **State Management**: React Query (TanStack Query) for server state
- **UI Components**: shadcn/ui + Tailwind CSS

## Database Schema

### Core Tables

1. **questions** - SAT practice questions
   - Sections: Reading, Math, Grammar
   - Difficulty levels: easy, medium, hard
   - Includes explanations and multiple choice options

2. **lessons** - Educational content
   - Categories: Reading, Math, Grammar, Strategy
   - Structured content with titles and body text

3. **flashcards** - Vocabulary and concepts
   - Categories: Reading, Math, Grammar
   - Terms and definitions

### User Data Tables

4. **user_progress** - Quiz attempt history
   - Tracks each question attempt
   - Records correctness and time spent
   - Auto-updates user_stats via trigger

5. **user_bookmarks** - Saved questions for review
   - Many-to-many relationship between users and questions

6. **user_stats** - Aggregated statistics
   - Total attempts and correct answers
   - Statistics per section (Reading, Math, Grammar)
   - Auto-updated via database triggers

7. **flashcard_progress** - Spaced repetition system
   - Tracks flashcard review progress
   - Implements SRS algorithm for optimal review timing

## Security

All user data is protected by **Row Level Security (RLS)** policies:

- Users can only read their own progress, bookmarks, and stats
- Users can only create/update/delete their own records
- Public tables (questions, lessons, flashcards) are read-only for all authenticated users

## Data Flow

### Questions, Lessons, Flashcards
```
React Component → useQuestions/useLessons/useFlashcards hooks
  → Supabase service functions
  → Supabase Database
```

### User Progress & Bookmarks
```
React Component → Hybrid hooks (useQuizProgressHybrid, etc.)
  → Checks authentication status
  → If authenticated: Supabase
  → If not authenticated: localStorage (fallback)
```

### Real-time Updates
- React Query automatically refetches data when mutations occur
- Optimistic updates for better UX
- Cache invalidation ensures data consistency

## Key Features

### 1. Hybrid Storage System
- Authenticated users: Data stored in Supabase (cloud-synced)
- Unauthenticated users: Data stored in localStorage (local only)
- Seamless transition when user signs up/logs in

### 2. Automatic Statistics
- Database triggers automatically update user_stats when progress is recorded
- No manual aggregation needed
- Always up-to-date statistics

### 3. Efficient Caching
- React Query caches all data
- Reduces database queries
- Fast page loads and navigation

### 4. Type Safety
- Full TypeScript support
- Database types generated from Supabase schema
- Compile-time error checking

## Migration Strategy

If you have existing localStorage data:

1. Export data from localStorage (if export feature exists)
2. Sign up/login to create account
3. Data will be saved to Supabase going forward
4. Historical data can be imported via a migration script (future feature)

## API Endpoints

All data access goes through Supabase client:

- **Questions**: `supabase.from('questions').select()`
- **Lessons**: `supabase.from('lessons').select()`
- **Flashcards**: `supabase.from('flashcards').select()`
- **User Progress**: `supabase.from('user_progress').insert()`
- **Bookmarks**: `supabase.from('user_bookmarks').insert()/delete()`
- **Stats**: `supabase.from('user_stats').select()`

## Performance Optimizations

1. **Batch Inserts**: Progress saved individually but stats aggregated
2. **Indexed Queries**: Database indexes on frequently queried columns
3. **Query Caching**: React Query caches responses
4. **Lazy Loading**: Components load data only when needed
5. **Pagination Ready**: Schema supports pagination for large datasets

## Monitoring & Analytics

You can monitor the application in Supabase dashboard:

- **Database**: View tables, query logs, performance
- **Authentication**: User signups, active sessions
- **API**: Request logs, errors
- **Storage**: (if you add file storage later)

## Future Enhancements

Potential additions:

1. **Real-time Collaboration**: Study groups with Supabase Realtime
2. **Leaderboards**: Public stats comparison
3. **Analytics Dashboard**: Detailed progress visualization
4. **Mobile App**: React Native with same backend
5. **Offline Support**: Service Workers for offline access
6. **Export/Import**: Backup and restore user data

## Troubleshooting

### Data not syncing
- Check Supabase connection in browser console
- Verify RLS policies are enabled
- Check user authentication status

### Slow queries
- Check database indexes are created
- Review query logs in Supabase dashboard
- Consider adding more specific indexes

### Migration issues
- Ensure all migration files are run in order
- Check for foreign key constraint violations
- Verify enum types match TypeScript types






