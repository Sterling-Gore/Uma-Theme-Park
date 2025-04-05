// Frontend/src/components/Footer/Footer.js

import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import GitHubLogo from './GithubLogo';
import './Footer.css';
import AuthProvider from '../../context/AuthContext';

const Footer = () => {

  const { isLoggedIn } = useContext(AuthProvider);

  return (
    <footer className="footer">
      <div className="left-container">
        <span>© {new Date().getFullYear()} Blue Horizon Adventure</span>
      </div>
      
      <div className="right-container">
        {!isLoggedIn ? (
          <>
            <NavLink className="links-footer" to="/EmployeeLogin">Employee Login</NavLink>
          </>
        ) : null}
        <NavLink className="links-footer" to="https://github.com/Sterling-Gore/Uma-Theme-Park">
          <GitHubLogo />
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;