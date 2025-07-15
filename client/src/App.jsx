import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BugList from './components/BugList';
import BugForm from './components/BugForm';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <ErrorBoundary>
          <h1 className="text-3xl font-bold mb-4">Bug Tracker</h1>
          <Routes>
            <Route path="/" element={<BugList />} />
            <Route path="/create" element={<BugForm />} />
            <Route path="/edit/:id" element={<BugForm />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;