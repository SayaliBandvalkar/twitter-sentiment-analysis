
import React from "react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section - About */}
        <div className="footer-section">
          <h3>About Us</h3>
          <p>We strive to improve TweetHub using data-driven solutions.</p>
        </div>

        {/* Middle Section - Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: sayalibandvalkar27@gmail.com</p>
          <p>Location: Mumbai, India</p>
        </div>

        {/* Right Section - Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© 2025 TweetHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
