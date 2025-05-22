import React from "react";

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="logo">Zentry</div>
      <nav>
        <a href="#">📄 Projects</a>
        <a href="#">👤 Administrators</a>
        <a href="#">👥 Users</a>
        <a href="#">➡ Logout</a>
      </nav>
    </div>
  );
}

export default Sidebar;
