# Full-Stack Authentication System – React, Node.js, Express & Neon PostgreSQL

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Running the Project Locally](#running-the-project-locally)
  - [Backend Setup](#backend-setup)
  - [Google OAuth Setup](#google-oauth-setup)
  - [Facebook OAuth Setup](#facebook-oauth-setup)
  - [GitHub OAuth Setup](#github-oauth-setup)
  - [LinkedIn OAuth Setup](#linkedin-oauth-setup)
  - [Neon PostgreSQL Setup](#neon-postgresql-setup)
  - [SendGrid Setup](#sendgrid-setup)
  - [Backend Environment Variables](#backend-environment-variables)
  - [Running the Backend](#running-the-backend)
  - [Frontend Setup](#frontend-setup)
- [Key Features](#key-features)
- [Conclusion](#conclusion)

## Overview

This project is a full-stack authentication system built with **React, Node.js, Express.js, TypeScript, and Neon Serverless PostgreSQL**. It provides a reusable foundation for developing modern web applications with secure and comprehensive authentication functionality.

The system supports traditional email and password authentication, as well as social login through Google, Facebook, GitHub, and LinkedIn OAuth providers.

Authentication is implemented using JWT access and refresh tokens stored in HTTP-only cookies. The system also includes account verification, password recovery, and password reset functionality.

The frontend handles the complete authentication flow, including protected and public routes, using React, Redux, React Query, and React Router DOM.

The backend, powered by Node.js and Express.js, manages user registration, login, OAuth authentication, email verification, and password recovery. Neon Serverless PostgreSQL is used as the database.

OAuth authentication is implemented without relying on dedicated third-party OAuth authentication packages, providing a practical understanding of the underlying authentication flow.

This project is designed to be a reusable starting point for developers who want to integrate a complete authentication system into their React and Node.js applications.

## Technology Stack

The project uses the following technologies:

### Frontend

- React
- TypeScript
- Redux
- React Query
- React Router DOM

### Backend

- Node.js
- Express.js
- TypeScript
- JSON Web Tokens (JWT)
- bcryptjs

### Database

- Neon Serverless PostgreSQL
- PostgreSQL

### Authentication

- Email and password authentication
- Google OAuth
- Facebook OAuth
- GitHub OAuth
- LinkedIn OAuth
- JWT access and refresh tokens
- HTTP-only cookies

### Email Services

- SendGrid

## Running the Project Locally

Follow these instructions to set up and run the project on your local machine.

### Backend Setup

1. Clone this repository and open it in your preferred code editor or terminal.

2. Navigate to the backend directory:

```bash
cd backend
```

3. Install the dependencies:

```bash
npm install
```

### Google OAuth Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com).
2. Create a new project and configure OAuth credentials.
3. Obtain your Client ID and Client Secret.
4. Configure the authorized redirect URI:

```text
http://localhost:3005/api/v1/auth/google-oauth
```

5. Add the following environment variables to your backend `.env` file:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CLIENT_REDIRECT_URL=http://localhost:3005/api/v1/auth/google-oauth
```

### Facebook OAuth Setup

1. Visit [Facebook Developer Tools](https://developers.facebook.com/apps).
2. Create a new application.
3. Obtain your App ID and App Secret.
4. Configure the OAuth redirect URI:

```text
http://localhost:3005/api/v1/auth/facebook-oauth
```

5. Add the following environment variables to your backend `.env` file:

```env
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:3005/api/v1/auth/facebook-oauth
```

### GitHub OAuth Setup

1. Visit [GitHub Developer Settings](https://github.com/settings/developers).
2. Create a new OAuth application.
3. Obtain your Client ID and Client Secret.
4. Configure the authorization callback URL:

```text
http://localhost:3005/api/v1/auth/github-oauth
```

5. Add the following environment variables to your backend `.env` file:

```env
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_REDIRECT_URL=http://localhost:3005/api/v1/auth/github-oauth
```

### LinkedIn OAuth Setup

1. Visit [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps).
2. Create a new application.
3. Configure the required OAuth permissions.
4. Obtain your Client ID and Client Secret.
5. Configure the authorized redirect URL:

```text
http://localhost:3005/api/v1/auth/linkedin-oauth
```

6. Add the following environment variables to your backend `.env` file:

```env
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:3005/api/v1/auth/linkedin-oauth
```

Make sure all configured callback URLs match the actual OAuth routes in your backend.

### Neon PostgreSQL Setup

1. Visit [Neon Console](https://console.neon.tech).
2. Create a new Neon project.
3. Create or select a PostgreSQL database.
4. Obtain your PostgreSQL connection details.
5. Add the following environment variables to your backend `.env` file:

```env
PGHOST=your-pg-host
PGDATABASE=your-pg-database
PGUSER=your-pg-user
PGPASSWORD=your-pg-password
ENDPOINT_ID=your-pg-endpoint-id
```

### SendGrid Setup

This project uses SendGrid for sending account verification and password recovery emails.

1. Visit [SendGrid](https://login.sendgrid.com/login/identifier).
2. Create an account.
3. Generate a SendGrid API key.
4. Configure and verify a sender email address.
5. Add the following environment variables to your backend `.env` file:

```env
MAIL_FROM=your-verified-sender-email
SENDGRID_API_KEY=your-api-key
```

### Backend Environment Variables

Create a `.env` file inside the backend directory.

Your backend environment configuration should look similar to this:

```env
PORT=3005
NODE_ENV=development

# Database
PGHOST=your-pg-host
PGDATABASE=your-pg-database
PGUSER=your-pg-user
PGPASSWORD=your-pg-password
ENDPOINT_ID=your-pg-endpoint-id

# Frontend
FRONTEND_BASE_URL=http://localhost:5173

# JWT Secrets
JWT_ACCOUNT_ACTIVATION=your-unique-secret
ACCESS_TOKEN_SECRET=your-unique-secret
REFRESH_TOKEN_SECRET=your-unique-secret
FORGET_PASSWORD_SECRET=your-unique-secret

# Email
MAIL_FROM=your-verified-sender-email
SENDGRID_API_KEY=your-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CLIENT_REDIRECT_URL=http://localhost:3005/api/v1/auth/google-oauth

# Facebook OAuth
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:3005/api/v1/auth/facebook-oauth

# GitHub OAuth
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret
GITHUB_REDIRECT_URL=http://localhost:3005/api/v1/auth/github-oauth

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-client-id
LINKEDIN_CLIENT_SECRET=your-client-secret
LINKEDIN_REDIRECT_URI=http://localhost:3005/api/v1/auth/linkedin-oauth
```

Use strong, unique secrets for all JWT-related environment variables. Never commit your `.env` file to version control or expose OAuth client secrets in frontend environment variables.

### Running the Backend

To build the backend, run:

```bash
npm run build
```

To start the backend in development mode, run:

```bash
npm run dev
```

The backend should now be running at:

```text
http://localhost:3005
```

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file inside the frontend directory and add the following environment variable:

```env
VITE_BACKEND_BASE_URL=http://localhost:3005/api/v1
```

OAuth client secrets must remain on the backend. The frontend should initiate OAuth flows through backend endpoints rather than exposing provider secrets.

Start the frontend development server:

```bash
npm run dev
```

The frontend should now be available at:

```text
http://localhost:5173
```

## Key Features

1. **User Registration:** Users can create accounts using their email address and password.
2. **Email Verification:** Newly registered users can verify their accounts through email.
3. **User Login:** Secure authentication using email and password.
4. **Social Authentication:** Sign in or register using Google, Facebook, GitHub, and LinkedIn.
5. **JWT Authentication:** Access and refresh token-based authentication.
6. **HTTP-only Cookies:** Secure token storage using HTTP-only cookies.
7. **Protected Routes:** Restrict access to authenticated users.
8. **Password Recovery:** Users can request password reset links through email.
9. **Password Reset:** Users can securely reset their passwords.
10. **Session Management:** Refresh access tokens and manage authenticated sessions.
11. **Authentication State Management:** Manage application authentication state using Redux and React Query.
12. **OAuth Integration:** Social authentication flows implemented without dedicated third-party OAuth authentication packages.

## Conclusion

This project provides a reusable foundation for implementing a complete authentication system in modern full-stack web applications.

By combining React, Node.js, Express.js, TypeScript, and Neon Serverless PostgreSQL, it brings together frontend authentication flows, backend security, database management, and social login integrations in one solution.

With features such as JWT-based authentication, HTTP-only cookie storage, email verification, password recovery, and multiple OAuth providers, developers can use this project as a starting point for building secure and maintainable applications.

Whether you are developing a portfolio platform, SaaS application, dashboard, or any other web application, this authentication system can help simplify the implementation of user authentication and account management.
