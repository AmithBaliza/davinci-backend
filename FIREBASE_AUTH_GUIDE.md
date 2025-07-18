# Firebase Authentication Integration Guide

This guide explains how the Firebase Authentication system is integrated with your Node.js backend and how to use it effectively.

## Overview

The backend uses Firebase Admin SDK for authentication, which allows you to:

- Verify Firebase ID tokens from your mobile app
- Sync user data between Firebase and your local PostgreSQL database
- Manage user roles and permissions
- Handle authentication seamlessly across platforms

## Architecture

```
Mobile App (Flutter) → Firebase Auth → Backend API → PostgreSQL Database
                                    ↓
                              Firebase Admin SDK
```

## Environment Variables

Make sure these Firebase environment variables are set in your `.env` file:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

## Authentication Flow

### 1. Mobile App Authentication

Your Flutter app handles user authentication (email/password, Google, Apple) using Firebase Auth SDK and gets an ID token.

### 2. API Requests

Include the Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### 3. Backend Verification

The backend verifies the token using Firebase Admin SDK and automatically syncs user data.

## API Endpoints

### Authentication Endpoints (`/api/auth`)

#### Verify Token

```http
POST /api/auth/verify
Authorization: Bearer <firebase-id-token>
```

Verifies the token and returns user data from both Firebase and local database.

#### Refresh User Data

```http
POST /api/auth/refresh
Authorization: Bearer <firebase-id-token>
```

Syncs latest user data from Firebase to local database.

#### Admin Operations (SUPERADMIN only)

**Set Custom Claims**

```http
POST /api/auth/custom-claims
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "uid": "firebase-user-uid",
  "customClaims": {
    "role": "admin",
    "permissions": ["read", "write"]
  }
}
```

**Revoke Refresh Tokens**

```http
POST /api/auth/revoke-tokens
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "uid": "firebase-user-uid"
}
```

**Delete User**

```http
DELETE /api/auth/user
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "uid": "firebase-user-uid"
}
```

**Get User by Email**

```http
GET /api/auth/user/user@example.com
Authorization: Bearer <firebase-id-token>
```

**Create Custom Token**

```http
POST /api/auth/custom-token
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "uid": "firebase-user-uid",
  "additionalClaims": {
    "role": "premium"
  }
}
```

### User Management Endpoints (`/api/users`)

#### Current User Operations

**Get Current User**

```http
GET /api/users/me
Authorization: Bearer <firebase-id-token>
```

**Update Current User**

```http
PUT /api/users/me
Authorization: Bearer <firebase-id-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "language": "es",
  "ambientMusic": false,
  "communicationEnabled": true
}
```

**Sync Current User**

```http
POST /api/users/me/sync
Authorization: Bearer <firebase-id-token>
```

**Notification Management**

```http
PATCH /api/users/me/notifications/increment
Authorization: Bearer <firebase-id-token>

PATCH /api/users/me/notifications/reset
Authorization: Bearer <firebase-id-token>
```

#### Admin Operations (SUPERADMIN only)

**Get All Users**

```http
GET /api/users?role=USER&language=en&limit=10&offset=0
Authorization: Bearer <firebase-id-token>
```

**Get User Statistics**

```http
GET /api/users/stats
Authorization: Bearer <firebase-id-token>
```

## User Data Model

The local database stores additional user information not available in Firebase:

```typescript
interface User {
  id: string; // UUID
  firebaseUid: string; // Firebase UID (unique)
  ambientMusic: boolean; // App preference
  communicationEnabled: boolean; // Notification preference
  deviceModel?: string; // Device information
  deviceType?: string; // iOS/Android
  name?: string; // Display name
  email?: string; // Email address
  gender?: "MALE" | "FEMALE" | "OTHERS";
  ipAddress?: string; // Last known IP
  isPrivacyPolicyEnabled: boolean;
  language: "en" | "es" | "ca" | "pt" | "fr" | "de" | "it";
  role: "USER" | "SUPERADMIN";
  yearOfBirth?: string;
  notificationCount: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}
```

## Middleware Usage

### Authentication Middleware

**Required Authentication**

```typescript
import { authenticateToken } from "./middlewares/auth";

router.get("/protected", authenticateToken, controller.protectedRoute);
```

**Optional Authentication**

```typescript
import { optionalAuth } from "./middlewares/auth";

router.get("/public-or-private", optionalAuth, controller.flexibleRoute);
```

**Role-based Access**

```typescript
import { authenticateToken, requireRole } from "./middlewares/auth";

router.get(
  "/admin-only",
  authenticateToken,
  requireRole("SUPERADMIN"),
  controller.adminRoute,
);
```

## Auto-Sync Behavior

The system automatically syncs users from Firebase to the local database:

1. **First API Call**: If a user doesn't exist locally, they're automatically created
2. **Token Verification**: Updates email and display name from Firebase
3. **Manual Sync**: Use `/api/users/me/sync` to force synchronization

## Error Handling

Common authentication errors:

- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Insufficient permissions (role-based)
- `404 Not Found`: User not found
- `400 Bad Request`: Invalid request data

## Security Features

1. **Token Verification**: All tokens are verified against Firebase
2. **Role-based Access**: SUPERADMIN role for administrative operations
3. **Rate Limiting**: API rate limiting to prevent abuse
4. **CORS Protection**: Configured CORS policies
5. **Helmet Security**: Security headers for protection

## Best Practices

### Mobile App Integration

1. **Token Management**: Refresh tokens before they expire
2. **Error Handling**: Handle 401 errors by re-authenticating
3. **Offline Support**: Cache user data for offline functionality

### Backend Development

1. **Middleware Order**: Always use `authenticateToken` before `requireRole`
2. **Error Logging**: All authentication errors are logged
3. **User Sync**: Let the system auto-sync users, don't force manual creation

### Production Deployment

1. **Environment Variables**: Secure Firebase credentials
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Validation**: Verify token issuer and audience
4. **Monitoring**: Monitor authentication failures and unusual patterns

## Testing

### Using Postman/Insomnia

1. Authenticate in your mobile app
2. Get the Firebase ID token
3. Use it in the Authorization header: `Bearer <token>`
4. Test various endpoints

### Example Token Verification

```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer <your-firebase-id-token>" \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Common Issues

1. **"Token has expired"**: Refresh the token in your mobile app
2. **"Invalid token"**: Check token format and Firebase project configuration
3. **"User not found"**: The user will be auto-created on first API call
4. **"Insufficient permissions"**: Check user role in database

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see detailed authentication logs.

## Migration from Firebase to Custom Auth

If you ever need to migrate away from Firebase:

1. The local database already contains all user data
2. Implement JWT token generation in the backend
3. Update mobile app to use custom authentication
4. User data and relationships remain intact

This architecture ensures you're not locked into Firebase and can migrate if needed while maintaining all user data and relationships.
