import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMenu } from 'react-icons/fi';
import { FaRegMoon, FaSun } from 'react-icons/fa';
import { IoMdSunny, IoMdMoon } from 'react-icons/io';
import "./Header.css";

const Header = ({ user, isMenuCollapsed, toggleMenu, darkMode, toggleDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [iconScale, setIconScale] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const handleDarkModeToggle = () => {
    setIsAnimating(true);
    setIconScale(1.5);
    setTimeout(() => {
      toggleDarkMode();
      setIconScale(1);
      setTimeout(() => setIsAnimating(false), 300);
    }, 150);
  };

  return (
    <header className={`main-header ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header-left">
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <FiMenu className="menu-icon" />
        </button>
      </div>

      <div className="header-right">
        <button
          className={`dark-mode-toggle ${isAnimating ? 'animating' : ''}`}
          onClick={handleDarkModeToggle}
          aria-label={darkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
          style={{ transform: `scale(${iconScale})` }}
        >
          {darkMode ? (
            <IoMdSunny className="mode-icon sun-icon" />
          ) : (
            <IoMdMoon className="mode-icon moon-icon" />
          )}
        </button>

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