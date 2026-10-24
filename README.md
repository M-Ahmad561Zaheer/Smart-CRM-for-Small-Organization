# Smart-CRM-for-Small-Organization

Final-year project CRM frontend for web and mobile.

## Projects

- `web/project`: React and Vite web application.
- `mobile/my-app`: React Native and Expo mobile application.

## Run the web app

```sh
cd web/project
npm install
npm run dev
```

## Run the mobile app

```sh
cd mobile/my-app
npm install
npm start
```

## Current screens

- Login
- Create Workspace
- School Dashboard with overview cards, revenue chart, student growth, and class schedule
- Form validation and navigation

Open **Preview School Dashboard** from the login screen to view the School workspace with sample data. The web route is `#school-dashboard`; the Expo route is `/school-dashboard`. Dashboard action panels are previews until the detailed modules and APIs are supplied.

Backend authentication, workspace creation, password recovery, and Google sign-in are pending API integration.

## Checks

Web: `npm run lint` and `npm run build`.
Mobile: `npm run lint` and `npx tsc --noEmit`.
