import React from "react";

function Header() {
  return (
    <div className="header">
      <button className="btn">Add Project</button>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ marginRight: "10px", textAlign: "right" }}>
          <div>John</div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>Admin</div>
        </div>
        <div className="avatar">
          <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="User" />
        </div>
      </div>
    </div>
  );
}

export default Header;
