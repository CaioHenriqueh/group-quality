import { useState } from 'react';
import './layout.css'
const Layout = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [showAddProject, setShowAddProject] = useState(false);
    const [showJoinAdmin, setShowJoinAdmin] = useState(false);

    return (
        <div className="zentry-app">
            <header className="app-header">
                <h1>Zentry</h1>
            </header>

            <nav className="main-nav">
                <ul>
                    <li
                        className={activeTab === 'projects' ? 'active' : ''}
                        onClick={() => setActiveTab('projects')}
                    >
                        Projects
                    </li>
                    <li
                        className={activeTab === 'administrators' ? 'active' : ''}
                        onClick={() => setActiveTab('administrators')}
                    >
                        Administrators
                    </li>
                    <li
                        className={activeTab === 'users' ? 'active' : ''}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </li>
                </ul>
            </nav>

            <div className="content">
                {activeTab === 'projects' && (
                    <div className="projects-section">
                        <div className="action-buttons">
                            <button
                                className="primary-btn"
                                onClick={() => {
                                    setShowAddProject(true);
                                    setShowJoinAdmin(false);
                                }}
                            >
                                Add Project
                            </button>
                            <button
                                className="secondary-btn"
                                onClick={() => {
                                    setShowJoinAdmin(true);
                                    setShowAddProject(false);
                                }}
                            >
                                Join Admin
                            </button>
                        </div>

                        {showAddProject && (
                            <div className="form-section">
                                <h2>Add Project</h2>
                                <div className="divider"></div>
                                {/* Form fields would go here */}
                                <form>
                                    <input type="text" placeholder="Project name" />
                                    <textarea placeholder="Project description"></textarea>
                                    <button type="submit">Create Project</button>
                                </form>
                            </div>
                        )}

                        {showJoinAdmin && (
                            <div className="form-section">
                                <h2>Join Admin</h2>
                                <div className="divider"></div>
                                {/* Form fields would go here */}
                                <form>
                                    <input type="text" placeholder="Admin code" />
                                    <button type="submit">Join as Admin</button>
                                </form>
                            </div>
                        )}

                        <div className="test-planning-section">
                            <h2>Test Planning</h2>
                            <p>A platform for managing software testing</p>
                        </div>
                    </div>
                )}

                {activeTab === 'administrators' && (
                    <div className="administrators-section">
                        <h2>Administrators</h2>
                        {/* Administrators list would go here */}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-section">
                        <h2>Users</h2>
                        {/* Users list would go here */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Layout;