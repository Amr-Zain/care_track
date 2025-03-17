import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function NavItem( { to,closeMobileNav,children }) {
    const handleNavClick = ()=>closeMobileNav?closeMobileNav():null;

    return (  <Nav.Item>
                    <NavLink 
                        to={to} 
                        end  
                        className={({ isActive }) => `d-flex align-items-center text-decoration-none px-3 py-2 ${
                            isActive ? 'text-primary fw-bold' : 'text-muted'
                        }`}                                
                        onClick={handleNavClick}
                    >
                        {children}
                    </NavLink>
                </Nav.Item> );
            }

export default NavItem;