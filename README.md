Todo Web Application with Role-Based Authentication
Overview
This is a full-stack web application that features user authentication, role-based access control (RBAC), and todo management functionality. Users can register, log in, manage their todos, and admins have the ability to manage todos and users.

Frontend is built using React.js with Tailwind CSS for styling.

Backend is built using Express.js/Node.js with MongoDB for data storage.

Authentication is handled using JWT (JSON Web Token) to secure the app and validate users.

Role-based Access Control (RBAC) is implemented to restrict certain functionalities to admin users only.

Features
User Authentication & Authorization
Registration: Users can sign up with their email, username, and password.

Passwords are securely hashed with bcrypt before being stored in the database.

By default, all users are assigned the "user" role.

Login: Users can log in using either their email or username.

A JWT token is generated and sent to the client for session management.

The token includes the user's role (user/admin) for access control.

Todo Management
User Role:

Users can create, view, edit, and delete their own todos.

Admin Role:

Admins can view, edit, and delete todos created by any user.

Admins can view all users and todos via an admin dashboard.

Role-Based Access Control (RBAC)
Protected Routes:

All routes related to todos are protected. Only authenticated users can access them.

Only admin users can access certain routes (e.g., viewing and managing all todos, managing user roles).

Project Structure
bash
Copy
Edit
/client                       # React frontend application
  /public
  /src
    /components                # Reusable components (Button, Input, TodoCard, etc.)
    /pages                     # Page components (Login, Todo Dashboard, etc.)
    /styles                    # Tailwind CSS files
    App.js                     # Main app file
    index.js                   # Entry point for React
    tailwind.config.js         # Tailwind configuration
    package.json               # Frontend dependencies and scripts

/server                       # Backend Express app
  /controllers                 # Controllers for handling requests
  /models                      # Mongoose models (User, Todo)
  /routes                      # API routes (auth, todos, admin)
  /middleware                  # Authentication and authorization middleware
  /config                      # Config files (e.g., JWT secret)
  server.js                    # Main backend file
  .env                         # Environment variables (DB URI, JWT secret)
  package.json                 # Backend dependencies and scripts

# todolist_mern