// Frontend/src/components/Footer/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/activities">Activities</Link></li>
            <li><Link to="/dining">Dining</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/tickets">Tickets</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Customer Support</h3>
          <ul>
            <li><Link to="/problems">Report a Problem</Link></li>
            <li><Link to="/account">My Account</Link></li>
            <li><Link to="/myorders">Order History</Link></li>
            <li><a href="mailto:support@example.com">Contact Us</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Park Information</a></li>
            <li><a href="#">Special Events</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Theme Park. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;