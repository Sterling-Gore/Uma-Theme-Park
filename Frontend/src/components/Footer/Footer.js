// Frontend/src/components/Footer/Footer.js

import React from 'react';
import { Link, NavLink } from 'react-router-dom';
//import GitHubIcon from '@mui/icons-material/GitHub';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="left-container">
        <span>© {new Date().getFullYear()} Blue Horizon Adventure</span>
      </div>
      
      <div className="right-container">
        <NavLink className="links-footer" to="/EmployeeLogin">Employee Login</NavLink>
        <NavLink className="links-footer" to="https://github.com/Sterling-Gore/Uma-Theme-Park">
        </NavLink>
      </div>
    </footer>
  );
};

export default Footer;