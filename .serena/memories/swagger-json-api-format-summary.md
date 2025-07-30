# MuseTrip360 API - Swagger JSON Format Summary

## API Overview

- **API Title**: MuseTrip360 API
- **Version**: v1
- **Format**: OpenAPI 3.0.1
- **Base Path**: All endpoints prefixed with `/api/v1/`

## Core API Patterns

### Authentication & Authorization

- **Bearer Token**: JWT authentication required for protected endpoints
- **Multi-provider OAuth**: Google OAuth integration
- **RBAC**: Role-based access control (Admin, Organizer, User)
- **Standard responses**: 401 (Unauthorized), 403 (Forbidden)

### Standard Data Patterns

- **UUIDs**: All entity IDs use UUID format (`format: "uuid"`)
- **Pagination**: Consistent `Page` and `PageSize` query parameters
- **Search**: `SearchKeyword`/`Search` query parameters with length limits
- **Status filtering**: Boolean `IsActive` and enum status filters
- **Date/Time**: ISO 8601 format (`format: "date-time"`)

### HTTP Methods & Status Codes

- **GET**: 200 (Success), 404 (Not Found)
- **POST**: 200/201 (Created), 400 (Bad Request), 404 (Not Found)
- **PUT**: 200 (Updated), 400 (Bad Request), 404 (Not Found)
- **PATCH**: 200 (Updated), 401/403 (Auth errors), 404 (Not Found)
- **DELETE**: 200/204 (Deleted), 401/403 (Auth errors), 404 (Not Found)

## API Domains

### 1. AI Services (`/ai/*`)

- **Chat**: `/ai/chat` - AI chat functionality
- **Embedding**: `/ai/embedding` - Text embedding generation

### 2. Artifacts (`/artifacts/*`)

- **Public listing**: GET `/artifacts` with search/pagination
- **Admin listing**: GET `/artifacts/admin` with status filtering
- **CRUD operations**: GET/PUT/DELETE `/artifacts/{id}`
- **Museum-specific**: GET/POST `/museums/{museumId}/artifacts`
- **Activation**: PATCH `/artifacts/{id}/activate|deactivate`

### 3. Authentication (`/auth/*`)

- **Google OAuth Flow**: GET `/auth/google/login` & `/auth/google/callback`
- **Email/Password**: POST `/auth/register`, `/auth/login`
- **Token Management**: GET `/auth/verify-token`, POST `/auth/refresh`
- **Password Reset**: POST `/auth/forgot-password/request|verify`

### 4. Events (`/events/*`)

- **Public Events**: GET `/events` with complex filtering (museum, location, type, time range)
- **Admin Events**: GET `/events/admin` with status and deadline filtering
- **CRUD**: GET/PUT/DELETE `/events/{id}` (role-based permissions)
- **Museum Events**: GET/POST `/museums/{museumId}/events` & `/museums/{museumId}/events/request`
- **Workflow**: PATCH `/events/{id}/evaluate|cancel|submit`
- **Resource Management**: PUT `/events/{id}/add-artifacts|remove-artifacts|add-tour-onlines|remove-tour-onlines|add-tour-guides|remove-tour-guides`
- **Organizer View**: GET `/events/assigned`

### 5. Museums (`/museums/*`)

- **Listing**: GET `/museums` with search and status filtering
- **Creation**: POST `/museums` (request body required)

### 6. Messaging (`/messaging/*`)

- **Conversations**: GET/POST `/messaging/conversations`
- **Messages**: GET `/messaging/conversations/{conversationId}/messages`, POST `/messaging/messages`
- **Real-time**: PUT `/messaging/conversations/{conversationId}/last-seen`, POST `/messaging/conversations/{conversationId}/join`
- **Notifications**: GET/PUT `/messaging/notifications`, POST `/messaging/notifications/system|test`

## Key Schema References (Components)

- **Request DTOs**: `ChatReq`, `RegisterReq`, `LoginReq`, `RefreshReq`, etc.
- **Entity DTOs**: `ArtifactCreateDto`, `ArtifactUpdateDto`, `EventCreateDto`, `EventUpdateDto`, etc.
- **Admin DTOs**: `EventCreateAdminDto` (bypass approval workflow)
- **Enums**: `EventTypeEnum`, `EventStatusEnum`, `MuseumStatusEnum`
- **Messaging**: `CreateConversation`, `CreateMessage`, `CreateNotificationDto`

## Request/Response Patterns

- **Content Types**: `application/json`, `text/json`, `application/*+json`
- **Array Requests**: For adding/removing multiple items (artifacts, tours, guides)
- **Query Filters**: Complex filtering with multiple optional parameters
- **Consistent Error Handling**: Standard HTTP status codes with descriptive messages

## Security & Permissions

- **Public Endpoints**: Basic artifact/event listing, auth endpoints
- **User Authentication**: Most CRUD operations require authentication
- **Role-Based Access**: Admin vs Organizer vs regular User permissions
- **Museum-Scoped**: Many operations are scoped to specific museums
- **Resource Ownership**: Users can only modify their own content (with role exceptions)

This API follows REST conventions with clear resource hierarchy, consistent naming patterns, and comprehensive CRUD operations across all major entities.
