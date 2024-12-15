### Chat App with Rooms, Socket.IO, Redis, and PostgreSQL

This is a real-time chat application that supports user authentication, guest login, and room-based chatting. The application is designed for anonymous and temporary interactions, leveraging modern technologies for real-time updates and scalability.

---

## Features

- **Real-Time Communication**: Powered by Socket.IO for instant messaging.
- **Room Support**: Users can join specific chat rooms to engage in targeted conversations.
- **Authentication**: JWT-based authentication for registered users.
- **Guest Login**: Join the chat without signing up as a guest.
- **Typing Indicators**: Visual feedback for when users are typing.
- **Active User Tracking**: Display active users in a room.
- **Message History**:
  - **Redis**: Temporarily stores messages for quick access (1-hour expiry).
  - **PostgreSQL**: Stores messages for persistent storage (1-day retention).
- **Responsive UI**: Built with React to provide a clean and dynamic user experience.
- **Security Features**:
  - Rate limiting to prevent abuse.
  - Helmet.js for enhanced security.
  - Validations for all user inputs.

---

## Tech Stack

### Backend
- **Node.js** with **Express.js**: RESTful API and WebSocket server.
- **Socket.IO**: Real-time communication.
- **Redis**: Caching for real-time message retrieval.
- **PostgreSQL**: Persistent storage for chat messages and user data.
- **JWT**: Authentication and session management.
- **Rate-Limiter**: Limits requests to prevent abuse.
- **Helmet.js**: Security enhancements.

### Frontend
- **React**: User interface with dynamic components.
- **CSS**: Custom styling for a responsive and clean design.

---

## Installation and Setup

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL
- Redis

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Gyanaa-Vaibhav/Message_INC.git
   cd Message_INC/Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `Backend` directory with the following:
   ```env
   SERVER_PORT=9999
   DB_HOST=localhost
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_NAME=chat_app
   REDIS_HOST=localhost
   ACCESS_SECRET=your_access_secret
   REFRESH_SECRET=your_refresh_secret
   DEPLOYMENT_IP=http://localhost:3000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `Frontend` directory:
   ```bash
   cd ../Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `Frontend` directory with the following:
   ```env
   VITE_SERVER_IP=http://localhost:9999
   VITE_SOCJET_IP=http://localhost:3000
   ```

4. Start the frontend server:
   ```bash
   npm run dev
   ```

---

## How It Works

1. **User Authentication**:
   - Users can register/login or join as a guest.
   - JWT is used for authenticated routes and socket connections.

2. **Rooms and Messaging**:
   - Users can join specific rooms for focused discussions.
   - Messages are emitted to all clients in a room in real-time.

3. **Data Persistence**:
   - Messages are cached in Redis for quick retrieval.
   - PostgreSQL stores messages and user data for persistence.

4. **Typing Indicators**:
   - Real-time typing status updates are sent to all room participants.

---

## API Endpoints

### Public Routes
- `POST /login`: Authenticate user and return JWT.
- `POST /register`: Create a new user.
- `POST /guest`: Join the chat as a guest.

### Protected Routes
- `GET /current_user`: Get the current authenticated user.
- `GET /chat`: Retrieve the chat page.

---

## Screenshots

### Login Page
<img width="1291" alt="Screenshot 2024-12-15 at 8 34 11 PM" src="https://github.com/user-attachments/assets/8dd55315-e9b2-4094-89a4-b0e47abb354b" />


### Chat Room
<img width="1290" alt="Screenshot 2024-12-15 at 8 34 30 PM" src="https://github.com/user-attachments/assets/56166141-c2f0-4dfe-b82e-360a9708e05b" />


---

## Future Enhancements
- Add private messaging between users.
- Enhance the admin panel for managing users and rooms.
- Integrate with third-party services for notifications.

---

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.
