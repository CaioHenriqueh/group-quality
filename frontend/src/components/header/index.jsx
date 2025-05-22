import { useState } from 'react';
import "./Header.css";

const Header = ({ user, isMenuCollapsed, toggleMenu }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <div className="header-right">
        <div 
          className={`clean-user-profile ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Administrador'}</span>
          </div>
          
          <div className="user-avatar">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} />
            ) : (
              <span className="avatar-initials">
                {getInitials(user?.name)}
              </span>
            )}
            <div className="status-dot"></div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;