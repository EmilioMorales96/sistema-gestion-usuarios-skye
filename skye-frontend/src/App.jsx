import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, UserCreatedPage, UsersPage } from './pages';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Register route */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* User created confirmation route */}
          <Route path="/user-created" element={<UserCreatedPage />} />
          
          {/* Users route */}
          <Route path="/users" element={<UsersPage />} />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
