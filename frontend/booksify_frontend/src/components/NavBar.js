import React from 'react';
import { Link } from 'react-router-dom';
import { about } from './About'


const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
      <li>
          <Link to="/" className='logo'>Booksify</Link>
        </li>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
