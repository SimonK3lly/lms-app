// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to Last Man Standing</h1>
      <Link to="/admin">Organize a Competition</Link>
      <br />
      <Link to="/competition/1">Join Competition</Link> {/* Replace with dynamic competition list */}
    </div>
  );
}

export default Home;