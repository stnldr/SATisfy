# Authorization System

This document describes the authorization system that has been added to the StudySAT application.

## Features

### 🔐 Authentication
- **User Registration**: Users can create accounts with email and password
- **User Login**: Secure login with email/password authentication
- **Password Reset**: Email-based password reset functionality
- **Session Management**: Automatic session persistence and refresh

### 👤 User Management
- **User Profile**: View and manage user profile information
- **User Settings**: Comprehensive settings for notifications, appearance, and privacy
- **Account Deletion**: Secure account deletion with confirmation

### 🛡️ Security Features
- **Protected Routes**: Automatic redirection for unauthenticated users
- **Form Validation**: Client-side validation using Zod schemas
- **Secure Storage**: Session data stored securely in localStorage
- **Auto-refresh**: Automatic token refresh to maintain sessions

## Components

### Core Components
- `AuthContext`: React context for authentication state management
- `ProtectedRoute`: Wrapper component for route protection
- `LoginForm`: User login form with validation
- `SignupForm`: User registration form with validation
- `AuthModal`: Modal for authentication forms
- `UserMenu`: User dropdown menu with profile options

### Pages
- `/auth/login`: Login page
- `/auth/signup`: Registration page
- `/profile`: User profile page
- `/settings`: User settings page

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 2. Supabase Configuration
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Add the credentials to your `.env` file

### 3. Authentication Setup
The system uses Supabase Auth with the following configuration:
- Email/password authentication enabled
- Session persistence in localStorage
- Automatic token refresh
- Email confirmation (optional)

## Usage

### Authentication Flow
1. **Unauthenticated users** see login/signup buttons in the header
2. **Clicking login/signup** opens a modal with the respective form
3. **After successful authentication**, users see their profile menu
4. **Protected routes** automatically redirect to login if not authenticated

### User Experience
- **Seamless navigation**: Users can access public content without authentication
- **Progressive enhancement**: Additional features available after login
- **Data persistence**: User progress and settings are saved to the cloud
- **Responsive design**: Works on all device sizes

## Security Considerations

- **Client-side validation**: Forms validate input before submission
- **Secure storage**: Sensitive data stored securely in Supabase
- **Session management**: Automatic logout on token expiration
- **CSRF protection**: Built-in protection through Supabase
- **Password requirements**: Minimum 6 characters required

## Customization

### Adding New Protected Routes
```tsx
<Route path="/protected-page" element={
  <ProtectedRoute>
    <YourComponent />
  </ProtectedRoute>
} />
```

### Customizing User Menu
Edit `src/components/auth/UserMenu.tsx` to add new menu items or modify existing ones.

### Styling Authentication Forms
Modify the form components in `src/components/auth/` to match your design system.

## Troubleshooting

### Common Issues
1. **"useAuth must be used within an AuthProvider"**: Ensure the AuthProvider wraps your app
2. **Supabase connection errors**: Check your environment variables
3. **Form validation errors**: Ensure all required fields are filled correctly

### Debug Mode
Enable debug logging by adding `console.log` statements in the AuthContext for development.

## Future Enhancements

- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Advanced user permissions
- [ ] Admin dashboard
- [ ] User analytics
- [ ] Email templates customization







