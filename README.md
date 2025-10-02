# Реальний чат з WebSocket

Чат-додаток із груповими кімнатами.

## Реалізація

-  Авторизацію користувача (будь-яка заглушка)
-  Створення кімнат
-  Відправлення/отримання повідомлень у WebSocket-режимі
-  Показати онлайн-статуси
-  Покриття коду unit-тестами (71 тест)

## Технології

- React
- Redux-Saga
- Socket.io
- Material UI
- Vitest (тестування)
- React Testing Library
- TypeScript

Mock API/WebSocket сервер: `wss://ws.postman-echo.com/raw`
------------------------------------------------------------------------------

# Getting Started

## Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/klimenko2233/test-task-axels.git
cd test-task-axels

Install dependencies:
npm install or yarn install

Running the project:
npm run dev or yarn dev
The app will start on http://localhost:5173/.

Login
Use any username and password to login .

After login, you can see chat rooms and start sending messages.

Testing
The project is fully covered by unit tests (71 tests) using Vitest and React Testing Library.
Run tests: npm test
Run tests in watch mode (for development): npm run test:watch
Run tests with code coverage: npm run test:coverage

54 tests - React components (Snapshot tests + functionality)
16 tests - Redux reducers 




```