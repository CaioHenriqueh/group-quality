import { useState } from "react";
import SideMenu from "../menu";
import Header from "../header"; 
import './admin.css';

const Admin = ({ children, user }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`app-layout ${darkMode ? 'dark-mode' : ''}`}>
      <SideMenu 
        isCollapsed={isMenuCollapsed} 
        toggleCollapse={toggleMenu} 
        darkMode={darkMode}
      />
      <div className={`main-content ${isMenuCollapsed ? 'collapsed' : ''} ${darkMode ? 'dark-mode' : ''}`}>
        <Header 
          user={user} 
          isMenuCollapsed={isMenuCollapsed}
          toggleMenu={toggleMenu}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Admin;
