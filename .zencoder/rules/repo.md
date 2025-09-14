# DashStream Mobile App Repository

## Project Overview
DashStream is a React Native mobile application for on-demand home services, built with TypeScript and Expo. It includes a backend API for authentication, booking management, and service delivery.

## Architecture

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **HTTP Client**: Axios
- **UI Framework**: NativeWind (Tailwind CSS for React Native)

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT with refresh tokens
- **Environment**: Development/Production configs

## Key Directories

### Mobile App (`DashStream_Apk/`)
- `src/context/`: React Context providers (AuthContext)
- `src/services/`: API service classes and HTTP client
- `src/hooks/`: Custom React hooks for API calls and state management
- `src/utils/`: Utility functions (error handling, validation)
- `src/screens/`: Screen components organized by feature
- `src/components/`: Reusable UI components
- `src/types/`: TypeScript type definitions

### Backend (`DashStream_Apk_backend/`)
- `src/controllers/`: API route handlers
- `src/services/`: Business logic services
- `src/models/`: Database models
- `src/middleware/`: Express middleware
- `src/routes/`: API route definitions

## Authentication Flow
1. User sends OTP request with phone number
2. Backend generates and sends OTP
3. User verifies OTP
4. Backend returns access token and refresh token
5. Mobile app stores both tokens in AsyncStorage
6. HTTP client automatically includes access token in requests
7. When access token expires, HTTP client automatically refreshes using refresh token

## Common Issues & Solutions

### Token Refresh Issues
- Ensure both access and refresh tokens are stored after successful login
- Check that refresh token endpoint is correctly configured
- Verify token storage keys are consistent across the app

### API Error Handling
- All API calls use centralized error handling through `errorHandler.ts`
- Errors are automatically displayed to users via alerts
- Authentication errors trigger automatic logout

### Development Environment
- Use `__DEV__` flag for development-only logging
- API endpoints are configurable via environment variables
- Mock data should be avoided - all data comes from API

## Best Practices
1. **API-First Development**: All data must come from backend API
2. **No Hardcoded Data**: Avoid mock or fallback data in production
3. **Centralized Error Handling**: Use error handler utilities consistently
4. **Type Safety**: Maintain strict TypeScript types for API responses
5. **Authentication Security**: Always validate tokens and handle refresh properly

## Recent Fixes Applied
- Added missing `handleApiError` and `retryOperation` functions
- Implemented `useAdminBookingActions` hook for admin operations
- Enhanced token refresh mechanism with better error handling
- Improved authentication status checking
- Added proper error handling for missing refresh tokens