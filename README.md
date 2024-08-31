MERN (Full Stack Neon Starter kit with complete authentication) Submission for Neon Open Source Starter Kit Challenge

*This is a submission for the [Neon Open Source Starter Kit Challenge ](https://dev.to/challenges/neon): Ultimate Starter Kit*

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview of starter kit](#overview-of-starter-kit)
- [Why I Choose this stack](#why-i-choose-this-stack)
- [Running this app locally](#running-this-app-locally)
- [Key Features](#key-features)
- [Conclusion](#conclusion)

## Overview of starter kit

This starter kit is perfect for building a TypeScript-supported MERN stack apps (MongoDB, Express, React, Node.js) using NeonDB as the database. This was my first time using NeonDB, and it was a great experience.

The kit includes complete frontend and backend code with a secure authentication system. It supports login with email and password or via OAuth (Google, Facebook, GitHub, LinkedIn), using JWT access and refresh tokens stored in HTTP-only cookies. It also provides features for user verification after signup, as well as password reset and recovery. OAuth authentication is implemented from scratch without third-party packages.

The frontend handles the full authentication flow with both protected and public routes, using React, Redux, React Query, and React Router DOM. The backend, powered by NeonDB (a fast and scalable PostgreSQL database), manages signup, login, OAuth flows, and password reset features, using packages like jsonwebtoken and bcryptjs.

If you're looking to build a TypeScript-supported MERN stack application, I'm confident that this starter kit will become your favorite tool.

## Why I Choose this stack

I chose this stack because it combines some of the most popular and efficient technologies available today, providing a solid foundation for building scalable and modern web applications. The MERN stack—MongoDB, Express, React, and Node.js—offers a seamless JavaScript development experience from frontend to backend, making it easier to maintain and extend the application. Additionally, using TypeScript adds type safety, which helps catch errors early and improves code quality.

For the database, I opted for NeonDB, a fast and scalable PostgreSQL-based solution. It offers the benefits of traditional relational databases, such as strong data consistency and support for complex queries, while also being optimized for performance and scalability, which is essential for modern applications.

Throughout the process, I learned how to effectively implement secure authentication systems, including OAuth, from scratch, without relying on third-party packages. This deepened my understanding of handling JWT access and refresh tokens securely using HTTP-only cookies. I also gained experience in managing user verification, password recovery, and building robust authentication flows that are both secure and user-friendly.

Using technologies like React Query and Redux for state management, I improved my skills in handling data fetching, caching, and managing application state effectively. Overall, this project provided valuable insights into building full-stack applications that are scalable, secure, and maintainable.

## Running this app locally

1. First Clone this repository and open in any cli.
2. Navigate to backend folder(cd backend)
   - ### Setting Backend
        In backend folder, run the following command.
        ```js
        npm install
        ```
   - ### Google OAUTH Setup:
        Now go to [Google's Console](https://console.cloud.google.com) and create a new project and get client id, client secret. The redirect URL Should be(In Our Case): http://localhost:3005/api/v1/auth/google-oauth
   - Now In Backend directory, Create a **.env** file. and Save this Client Id, Client Secret along with Redirect URL as shown below:
        ```js
            GOOGLE_CLIENT_ID=your-client-id
            GOOGLE_CLIENT_SECRET=your-client-secret
            GOOGLE_CLIENT_REDIRECT_URL=http://localhost:3005/api/v1/auth/google-oauth
        ```
    - ### Facebook OAuth Setup:
        1. Go to [Facebook Developer Tools](https://developers.facebook.com/apps) and create a new App and get an app id and app secret. And Provide redirect URL as: http://localhost:3005/api/v1/auth/facebook-oauth if it asks you.
    - Now In Backend directory, go to **.env** file. and Save this Client Id, Client Secret along with Redirect URL as shown below:
        ```js
            FACEBOOK_APP_ID=your-app-id
            FACEBOOK_APP_SECRET=your-app-secret
            FACEBOOK_REDIRECT_URI=http://localhost:3005/api/v1/auth/facebook-oauth
        ``` 
    - ### Github OAUTH Setup:
       1. Go to [github settings](https://github.com/settings/developers). And create a new app and get client id and client secret. And Provide redirect URL as: http://localhost:3005/api/v1/auth/github-oauth if it asks you.
    - Now In Backend directory, go to **.env** file. and Save this Client Id, Client Secret along with Redirect URL as shown below:
        ```js
            GITHUB_CLIENT_ID=your-client-id
            GITHUB_CLIENT_SECRET=your-client-secret
            GITHUB_REDIRECT_URL=http://localhost:3005/api/v1/auth/github-oauth
        ```
    - ### Linkedin OAUTH Setup 
       1. Go to [Linkedin Developer Tools](https://www.linkedin.com/developers/apps). And create a new app and get client id and client secret. And Provide redirect URL as: http://localhost:3005/api/v1/auth/linkedin-oauth if it asks you. You need to create a Compamny Page for this. ANd its completely free.
    - Now In Backend directory, go to **.env** file. and Save this Client Id, Client Secret along with Redirect URL as shown below:
        ```js
            LINKEDIN_CLIENT_ID=your-client-id
            LINKEDIN_CLIENT_SECRET=your-client-secret
            LINKEDIN_REDIRECT_URI=http://localhost:3005/api/v1/auth/linkedin-oauth
        ``` 
    - Now In Backend directory, go to **.env** file. and create the following ENV Variables:
        ```js
            PORT=3005
            NODE_ENV=development

            FRONTEND_BASE_URL=http://localhost:5173

            JWT_ACCOUNT_ACTIVATION=random-unique-string
            ACCESS_TOKEN_SECRET=random-unique-string
            REFRESH_TOKEN_SECRET=random-unique-string
            FORGET_PASSWORD_SECRET=random-unique-string

        ```
    - ### SendGrid Setup
        Login to [SendGrid](https://login.sendgrid.com/login/identifier) and obtain a new sendgrid-api-key. You need to create a verified sender there.
    - Now In Backend directory, go to **.env** file. and create the following ENV Variables:
        ```js
            MAIL_FROM=mail-of-the-verified-sender
            SENDGRID_API_KEY=your-api-key
        ```
    - ### Neon DB Setup
        Login to [Neon DB](https://console.neon.tech/app/projects) and create a project(1 project is free to create). And It will give you few db details. Make sure you are in node-postgres tab and add them to env variables
    - Now In Backend directory, go to **.env** file. and create the following ENV Variables:
        ```js
            PGHOST=your-pg-host
            PGDATABASE=your-pg-database
            PGUSER=your-pg-user
            PGPASSWORD=your-pg-password
            ENDPOINT_ID=your-pg-endpoint-id
        ```
    - After Doing all that, your **.env** file within backend directory should look like this:
        ```js
            PORT=3005
            NODE_ENV=development

            # DB:
            PGHOST='your-pg-host'
            PGDATABASE='your-pg-database'
            PGUSER='your-pg-user'
            PGPASSWORD='your-pg-password'
            ENDPOINT_ID='your-pg-endpoint'

            #END_POINTS
            FRONTEND_BASE_URL=http://localhost:5173

            #JWT:

            JWT_ACCOUNT_ACTIVATION=random-unique-secret
            ACCESS_TOKEN_SECRET=frandom-unique-secret
            REFRESH_TOKEN_SECRET=random-unique-secret
            FORGET_PASSWORD_SECRET=random-unique-secret

            #EMAIL:
            MAIL_FROM=your-sender-email
            SENDGRID_API_KEY=your-api-key

            # Oauth:
            #Google
            GOOGLE_CLIENT_ID=your-client-id
            GOOGLE_CLIENT_SECRET=your-client-secret
            GOOGLE_CLIENT_REDIRECT_URL=http://localhost:3005/api/v1/auth/google-oauth
            ## Facebook
            FACEBOOK_APP_ID=your-app-id
            FACEBOOK_APP_SECRET=your-app-secret
            FACEBOOK_REDIRECT_URI=http://localhost:3005/api/v1/auth/facebook-oauth
            ## GitHub
            GITHUB_CLIENT_ID=your-client-id
            GITHUB_CLIENT_SECRET=your-client-secret
            GITHUB_REDIRECT_URL=http://localhost:3005/api/v1/auth/github-oauth
            ## Linkedin
            LINKEDIN_CLIENT_ID=your-client-id
            LINKEDIN_CLIENT_SECRET=your-client-secret
            LINKEDIN_REDIRECT_URI=http://localhost:3005/api/v1/auth/linkedin-oauth
        ```
    - ### Building the app
        Within backend folder run the following command:
        ```js
            npm run build
        ```
    - ### Running the app
        Within backend folder run the following command:
        ```js
            npm run dev
        ```
    - Voila your backend Started Successfully
    - ### Setting Frontend
        In another terminal, Now go into frontend folder: cd ../frontend
    - Create a .env in frontend folder and add the following env variables:
        ```js
            VITE_BACKEND_BASE_URL=http://localhost:3005/api/v1

            # Oauth:
            #Google
            VITE_GOOGLE_CLIENT_ID=your-client-id
            VITE_GOOGLE_CLIENT_SECRET=your-client-secret
            VITE_GOOGLE_CLIENT_REDIRECT_URL=http://localhost:3005/api/v1/auth/google-oauth
            ## Facebook
            VITE_FACEBOOK_APP_ID=your-app-id
            VITE_FACEBOOK_APP_SECRET=your-app-secret
            VITE_FACEBOOK_REDIRECT_URI=http://localhost:3005/api/v1/auth/facebook-oauth
            ## GitHub
            VITE_GITHUB_CLIENT_ID=your-client-id
            VITE_GITHUB_CLIENT_SECRET=your-client-secret
            VITE_GITHUB_REDIRECT_URL=http://localhost:3005/api/v1/auth/github-oauth
            ## Linkedin
            VITE_LINKEDIN_CLIENT_ID=your-client-id
            VITE_LINKEDIN_CLIENT_SECRET=your-client-secret
            VITE_LINKEDIN_REDIRECT_URI=http://localhost:3005/api/v1/auth/linkedin-oauth
        ```
    - You can run the below command to start the frontend project
    ```js
        npm run dev
    ```

## Key Features
    1. Users can Signup using email and password (or) Google OAuth (or) Facebook OAUth (or) GitHub OAuth (or) Linkedin OAuth.
    2. Users Who Signed Up needs to verify their accounts
    3. Users can Login Using email and password (or) Google OAuth (or) Facebook OAUth (or) GitHub OAuth (or) Linkedin OAuth.
    4. Users Can Reset Their Password

## Conclusion

This starter kit provides a strong foundation for building MERN stack applications with secure and scalable authentication. By integrating MongoDB, Express, React, and Node.js, it offers a full-stack JavaScript development environment, making the development process smooth and consistent. With features like JWT-based access and refresh tokens, along with support for OAuth providers such as Google, Facebook, GitHub, and LinkedIn, this kit ensures a secure and user-friendly authentication experience. Using NeonDB as a serverless database solution enhances scalability and performance, making it a great choice for modern web applications. This starter kit is a valuable tool for developers looking to build reliable, scalable, and secure applications.




