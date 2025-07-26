import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/header';
import { Home } from './pages/Home/Home';
import './App.scss';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Здесь будут добавлены другие роуты */}
            </Routes>
          </main>
          <footer className="footer">
            <div className="footer-content">
              <p>&copy; 2024 КликТорг. Все права защищены.</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;