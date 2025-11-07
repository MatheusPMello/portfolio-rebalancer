// /client/src/App.tsx

// 1. Import routing components
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="App">
      {/* 3. Add a simple navigation bar (for testing) */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <Link to="/" className="navbar-brand">Portfolio Rebalancer</Link>
          <div>
            <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
            <Link to="/register" className="btn btn-light">Register</Link>
          </div>
        </div>
      </nav>

      {/* 4. Define your pages */}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h2>Welcome Home!</h2>} />
          <Route path="/login" element={<h2>Login Page</h2>} />
          <Route path="/register" element={<h2>Register Page</h2>} />
        </Routes>
      </div>
    </div>
  )
}

export default App