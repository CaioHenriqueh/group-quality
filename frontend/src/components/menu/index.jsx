import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";
import { FiLayers, FiUsers, FiUserCheck, FiSettings } from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";
import "./menu.css";

const SideMenu = ({ isCollapsed, toggleCollapse }) => {
    const [accessControlOpen, setAccessControlOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Projetos");
    const [isHovered, setIsHovered] = useState(false);

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
        if (window.innerWidth <= 768) {
            toggleCollapse();
        }
    };

    return (
        <motion.div
            className={`side-menu ${isCollapsed ? 'collapsed' : ''}`}
            initial={{ width: isCollapsed ? 80 : 280 }}
            animate={{
                width: isCollapsed ? (isHovered ? 280 : 80) : 280
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="menu-container">
                <div className="menu-header" onClick={isCollapsed ? toggleCollapse : undefined}>
                    <div className="logo-header">
                        <motion.h1
                            animate={{ opacity: isCollapsed && !isHovered ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            OT<span>P</span>
                        </motion.h1>
                        <motion.p
                            animate={{ opacity: isCollapsed && !isHovered ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            OnTestPlan
                        </motion.p>
                    </div>
                </div>

                <div className="menu-content">
                    <motion.ul className="menu-items">
                        <motion.li
                            className={`menu-section ${activeItem === "Projetos" ? "active" : ""}`}
                            onClick={() => handleItemClick("Projetos")}
                            whileHover={{ scale: 1.02 }}
                        >
                            <FiLayers className="menu-icon" />
                            <motion.span
                                animate={{ opacity: isCollapsed && !isHovered ? 0 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                Projetos
                            </motion.span>
                        </motion.li>

                        <motion.li
                            className={`menu-parent ${accessControlOpen ? "open" : ""}`}
                            onClick={() => setAccessControlOpen(!accessControlOpen)}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="parent-content">
                                <RiShieldUserLine className="menu-icon" />
                                <motion.span
                                    animate={{ opacity: isCollapsed && !isHovered ? 0 : 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Controle de Acesso
                                </motion.span>
                                <motion.div
                                    animate={{ opacity: isCollapsed && !isHovered ? 0 : 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {accessControlOpen ? <IoChevronUp /> : <IoChevronDown />}
                                </motion.div>
                            </div>

                            <AnimatePresence>
                                {(accessControlOpen && (!isCollapsed || isHovered)) && (
                                    <motion.ul
                                        className="submenu"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.li
                                            className={`submenu-item ${activeItem === "Administradores" ? "active" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleItemClick("Administradores");
                                            }}
                                            whileHover={{ x: 5 }}
                                        >
                                            <FiUserCheck className="submenu-icon" />
                                            Administradores
                                        </motion.li>
                                        <motion.li
                                            className={`submenu-item ${activeItem === "Usuários" ? "active" : ""}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleItemClick("Usuários");
                                            }}
                                            whileHover={{ x: 5 }}
                                        >
                                            <FiUsers className="submenu-icon" />
                                            Usuários
                                        </motion.li>
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </motion.li>

                        <motion.li
                            className={`menu-section ${activeItem === "Configurações" ? "active" : ""}`}
                            onClick={() => handleItemClick("Configurações")}
                            whileHover={{ scale: 1.02 }}
                        >
                            <FiSettings className="menu-icon" />
                            <motion.span
                                animate={{ opacity: isCollapsed && !isHovered ? 0 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                Configurações
                            </motion.span>
                        </motion.li>
                    </motion.ul>
                </div>

                <motion.div
                    className="menu-footer"
                    animate={{ opacity: isCollapsed && !isHovered ? 0 : 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="version">v2.4.1</div>
                    <div className="copyright">© 2025 OnTestPlan</div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SideMenu;