# Classroom Tracker

A modern classroom task management tool for students and teachers.

## Features

- User authentication (login/register)
- Create and join classrooms
- Subject-based task organization
- Real-time chat
- Responsive design

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB:
   - Install MongoDB locally, or
   - Use MongoDB Atlas (cloud)
   - Set the connection string in environment variables

3. Start the server:
```bash
npm run server
```

4. Start the frontend (in a new terminal):
```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/classroom-tracker
JWT_SECRET=your-secret-key-change-in-production
```

## Usage

1. Visit `http://localhost:5173` in your browser
2. Register a new account or login
3. Create or join a classroom
4. Start managing tasks and chatting!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Classrooms
- `POST /api/classrooms` - Create classroom
- `GET /api/classrooms/:code/tasks` - Get classroom tasks
- `POST /api/classrooms/:code/tasks` - Add task to classroom
- `PUT /api/tasks/:id` - Update task
- `GET /api/classrooms/:code/messages` - Get classroom messages

## Technologies Used

- Frontend: React, TypeScript, Bootstrap, Framer Motion
- Backend: Node.js, Express, MongoDB, Socket.io
- Authentication: JWT, bcrypt
- Real-time: Socket.io 