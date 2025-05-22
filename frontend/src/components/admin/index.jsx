import { useState } from "react";
import SideMenu from "../menu";
import Header from "../header"; 
import './admin.css';

const Admin = ({ children, user }) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  return (
    <div className="app-layout">
      <SideMenu 
        isCollapsed={isMenuCollapsed} 
        toggleCollapse={toggleMenu} 
      />
      <div className={`main-content ${isMenuCollapsed ? 'collapsed' : ''}`}>
        <Header 
          user={user} 
          isMenuCollapsed={isMenuCollapsed}
          toggleMenu={toggleMenu}
        />
        
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Admin;