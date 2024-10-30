# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Please install:
npm vite latest
express
node js
cors
The necessary mysql2 (if haven't)

To activate the app:
Activate the DB in workbench MySQL
Activate the backend (node server.js)
Activate the frontend (npm run dev)

To the server.js (backend) with jest:
add the following code at the very end of server.js:
export default app;

To install jest and run the test, you need jest and babel:
npm install --save-dev jest supertest
npm install --save-dev @babel/core @babel/preset-env babel-jest
Run the test: 
npm test -- --detectOpenHandles

In package.json backend, ensure you have the following right after >Debug:
  "scripts": {
    "test": "jest"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "type": "module",
  "jest": {
    "transform": {
      "^.+\\.js$": "babel-jest"
    }
  },
  "dependencies": {
    "axios": "^1.7.7",
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "mysql2": "^3.11.3",
    "sequelize": "^6.37.5"
  },
  "devDependencies": {
    "@babel/core": "^7.26.0",
    "@babel/preset-env": "^7.26.0",
    "babel-jest": "^29.7.0",
    "jest": "^29.7.0",
    "supertest": "^7.0.0"
  },

Run the test with jest:
npm test -- --detectOpenHandles 
