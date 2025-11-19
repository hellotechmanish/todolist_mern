// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import Login from './pages/Login';
import TodoDashboard from './pages/TodoDashboardPage';
import CreateTodoPage from './pages/CreateTodoPage';
import EditTodoPage from './pages/EditTodoPage';
import TodoAdminDashboardPage from './pages/TodoAdminDashboardPage';
import Home from './pages/Home';
import PrivateRoute from './utill/PrivateRoute';
import ErrorBoundary from './utill/ErrorBoundary';

const App = () => (
  <Router>
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route
          path="/todo-dashboard"
          element={
            <PrivateRoute>
              <TodoDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-todo"
          element={
            <PrivateRoute>
              <CreateTodoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-todo/:id"
          element={
            <PrivateRoute>
              <EditTodoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <TodoAdminDashboardPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </ErrorBoundary>
  </Router>
);

export default App;
