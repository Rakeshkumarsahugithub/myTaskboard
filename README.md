# TaskBoard - Full-Stack Task Management App

A modern, full-stack task management application built with Next.js that allows users to create multiple boards and manage their tasks efficiently.
**[🚀 View Live Demo](https://my-taskboard-chi.vercel.app/)**
<div style="display: flex; justify-content: space-between; align-items: center;">
  <img src="https://github.com/user-attachments/assets/76502475-7ac4-48c2-bb30-fd9427c3a879" width="400" height="400" style="margin-right: 10px;">
  <img src="https://github.com/user-attachments/assets/0ad18e83-9b90-452b-8ceb-0139e69318e8" width="500" height="500">
</div>
## Features


### 🔐 Authentication & Authorization
- **User Registration**: Secure sign-up with email validation
- **User Login**: JWT-based authentication
- **Protected Routes**: Only authenticated users can access their data
- **User Isolation**: Users can only access their own boards and tasks

### 📋 Task Management
- **Multiple Boards**: Create different boards for different purposes (Work, Personal, Groceries, etc.)
- **Rich Task Properties**:
  - Title and description
  - Status (Pending/Completed)
  - Due dates with visual indicators
  - Creation and update timestamps
- **Task Operations**: Add, edit, delete, and mark tasks as complete
- **Visual Status**: Color-coded status indicators and due date warnings

### 🎨 User Interface
- **Modern Design**: Clean, responsive UI with Tailwind CSS
- **Mobile-Friendly**: Responsive design that works on all devices
- **Interactive Elements**: Smooth animations and hover effects
- **Intuitive Navigation**: Easy switching between boards and tasks

### 🔧 Technical Features
- **RESTful APIs**: Complete CRUD operations for boards and tasks
- **Data Persistence**: JSON file-based storage (easily replaceable with a real database)
- **Error Handling**: Comprehensive error handling and validation
- **Security**: Password hashing, JWT tokens, and input validation

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: JWT tokens with bcryptjs
- **Database**: JSON file storage (in-memory)
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rakeshkumarsahugithub/myTaskboard.git
   cd mytaskboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Boards
- `GET /api/boards` - Get all boards for authenticated user
- `POST /api/boards` - Create a new board
- `PUT /api/boards` - Update a board
- `DELETE /api/boards` - Delete a board

### Tasks
- `GET /api/tasks?boardId=<id>` - Get all tasks for a board
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks` - Update a task
- `DELETE /api/tasks` - Delete a task

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── boards/
│   │   └── tasks/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── AuthContext.js
│   ├── LoginForm.js
│   ├── RegisterForm.js
│   ├── Dashboard.js
│   ├── TaskBoard.js
│   ├── BoardCard.js
│   ├── TaskCard.js
│   ├── AddBoardForm.js
│   └── AddTaskForm.js
└── lib/
    ├── auth.js
    ├── db.js
    └── utils.js
```

## Key Features Explained

### 1. User Authentication
- JWT tokens stored in localStorage
- Password hashing with bcryptjs
- Protected API routes with middleware
- Automatic token validation on app load

### 2. Board Management
- Users can create multiple boards
- Each board belongs to the authenticated user
- Boards can be renamed or deleted
- Visual board cards with creation dates

### 3. Task Management
- Tasks are organized by boards
- Rich task properties including due dates
- Visual indicators for overdue tasks
- Status toggling with checkboxes
- Inline editing capabilities

### 4. Security Features
- User data isolation
- Input validation and sanitization
- Secure password handling
- Protected API endpoints

### 5. User Experience
- Responsive design for all devices
- Loading states and error handling
- Smooth animations and transitions
- Intuitive navigation between views
<!-- 
## Future Enhancements

- [ ] Real database integration (PostgreSQL, MongoDB)
- [ ] Task categories and tags
- [ ] Task priority levels
- [ ] Drag and drop task reordering
- [ ] Task search and filtering
- [ ] Task sharing between users
- [ ] Email notifications for due dates
- [ ] Dark mode support
- [ ] Task templates
- [ ] Export/import functionality
-->
## How It Works

### File Contents and Rendering Approach

| File | Contents | Rendering Approach | Reason |
|------|----------|-------------------|--------|
| **src/app/page.js** | Main application entry point with conditional rendering for authentication, dashboard, and task board views | CSR (Client-Side Rendering) | Uses 'use client' directive, React hooks, and client-side authentication checks |
| **src/app/layout.js** | Root layout with AuthProvider wrapper | SSR (Server-Side Rendering) | Provides the base HTML structure and global context providers |
| **src/components/AuthContext.js** | Authentication context provider with login/logout functions and token management | CSR | Manages client-side auth state and localStorage interactions |
| **src/components/Dashboard.js** | Board listing and management interface | CSR | Uses client-side data fetching and state management |
| **src/components/TaskBoard.js** | Task listing and management for a specific board | CSR | Uses client-side data fetching and state management |
| **src/components/TaskCard.js** | Individual task display and interaction component | CSR | Handles client-side task operations and state |
| **src/app/api/boards/route.js** | API endpoints for board CRUD operations | API Routes | Server-side processing with authentication middleware |
| **src/app/api/tasks/route.js** | API endpoints for task CRUD operations | API Routes | Server-side processing with authentication middleware |
| **src/app/api/auth/login/route.js** | User login endpoint | API Routes | Handles authentication and token generation |
| **src/app/api/auth/register/route.js** | User registration endpoint | API Routes | Creates new users with secure password hashing |
| **src/lib/auth.js** | Authentication utilities (JWT, password hashing) | Server-side Utilities | Provides security functions for API routes |
| **src/lib/db.js** | Data storage and retrieval functions | Server-side Utilities | Handles JSON file-based database operations |
| **src/lib/utils.js** | Helper functions for validation, formatting, etc. | Shared Utilities | Used by both client and server components |

### Rendering Strategy Explanation

| Approach | Usage in TaskBoard | Benefits |
|----------|-------------------|----------|
| **CSR (Client-Side Rendering)** | Used for all interactive components and pages | Provides dynamic user interactions, state management, and client-side navigation |
| **SSR (Server-Side Rendering)** | Used for the root layout | Ensures proper HTML structure and faster initial page load |
| **API Routes** | Used for all data operations | Separates client and server concerns, provides authentication middleware |

The application primarily uses **Client-Side Rendering** because it's a highly interactive task management application where most operations happen after the initial page load. This approach allows for a responsive user interface with immediate feedback when creating, updating, or deleting tasks and boards.

The app uses Next.js's App Router for routing but doesn't heavily rely on SSR or SSG features since the content is personalized and requires authentication. Instead, it uses a combination of a server-rendered shell (layout.js) with client-rendered content (page.js and components) to create a responsive single-page application experience.

