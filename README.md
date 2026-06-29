# GraphOne Discovery Platform

## Overview

This project is my submission for the GraphOne Frontend Engineering Trial Task.

The goal of the assignment was to recreate the GraphOne interface using modern frontend technologies while maintaining the overall design language, layout, and user experience shown in the provided reference screens.

The application presents AI companies, investors, products, and an AI analysis workspace through a responsive dashboard built with React and TypeScript.



## Live Demo

Vercel Deployment

https://graphone-discovery.vercel.app


Backend API

https://graphone-discovery.onrender.com



## GitHub Repository

https://github.com/amogh895/graphone-discovery



## Features

The project includes the following functionality:

* AI Companies dashboard
* AI Products page
* Investors page
* AI Analyst workspace
* Company discovery interface
* Search interface
* Responsive layout
* Mock startup intelligence data
* REST API integration through an Express backend
* Gemini-powered AI analysis



## Technology Stack

Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Recharts
* Lucide React

Backend

* Node.js
* Express.js

AI

* Google Gemini API

Utilities

* Zod
* dotenv



## Project Structure

```
graphone-discovery
│
├── src
│   ├── components
│   ├── pages
│   ├── db
│   ├── hooks
│   └── utils
│
├── public
├── server.ts
├── package.json
└── .env.example
```

---

## Getting Started

Clone the repository

```bash
git clone https://github.com/amogh895/graphone-discovery.git
```

Move into the project

```bash
cd graphone-discovery
```

Install dependencies

```bash
npm install
```

Create a `.env` file using the values from `.env.example`.

Start the development server

```bash
npm run dev
```

The application will be available locally after the server starts.



## Environment Variables

The following environment variables are required.

```
GEMINI_API_KEY=
APP_URL=
DATABASE_URL=
GRAPHONE_SECRET_KEY=
```



## Design Notes

The interface is based on the GraphOne reference screens provided in the assessment. The implementation focuses on:

* Consistent spacing and typography
* Responsive layouts
* Reusable React components
* Clean TypeScript structure
* Interactive dashboard experience



## Future Improvements : What I Would Build Next If I Had 2 More Days

This project aims to enhance the usability of our application by improving the overall quality of the application as well as providing a better user experience.

If I had two additional days on this project, I would implement the following three significant improvements:

1. Replace mock data with a PostgreSQL database and provide a full API for pulling and managing the data.
2. Add advanced searching functionality with live suggestions for companies, investors, founders and products.
Enhance the functionality of the AI Analyst to provide better contextual responses based on the company or investor currently viewed by the user.

In addition to these improvements, I would provide additional enhancements to improve the user experience by adding:

3. Account authentication to allow users to save companies, products and searches for future reference;
4. Loading skeletons, improved error handling and new empty states across the application to enhance user experience; 
5. Tablets and mobile devices will allow for responsiveness;
6. Performance optimization through lazy loading, code splitting and images assets that are optimal;
7. Unit and integration tests for improved reliability and maintainability of the application;
8. A dark mode and additional accessibility improvements compliant with WCAG standards.



## Author

Amogh Dixit


GitHub

https://github.com/amogh895

LinkedIn

https://www.linkedin.com/in/amogh-dixit-9935702a6
