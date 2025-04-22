// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage';
import Login from './pages/Login';
import TodoDashboard from './pages/TodoDashboardPage';
import CreateTodoPage from './pages/CreateTodoPage';
import EditTodoPage from './pages/EditTodoPage';
import TodoAdminDashboardPage from './pages/TodoAdminDashboardPage';
import Home from './pages/Home'; // Home page
import PrivateRoute from './utill/PrivateRoute';
import ErrorBoundary from './utill/ErrorBoundary';


function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationPage />} />

          {/* Protected Routes */}
          <Route path="/todo-dashboard" element={<PrivateRoute> <TodoDashboard />
          </PrivateRoute>}
          />
          <Route
            path="/create-todo" element={<PrivateRoute> <CreateTodoPage />
            </PrivateRoute>
            }
          />
          <Route path="/edit-todo/:id" element={<EditTodoPage />} /> {/* Edit Todo */}
          {/* Other Routes */}
          <Route path="/admin" element={<TodoAdminDashboardPage />} />

          {/* <Route path="/admin-dashboard" element={<PrivateRoute> <AdminDashboard />
          </PrivateRoute>}
          /> */}
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
