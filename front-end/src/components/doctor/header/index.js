import { useCallback, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import { RiMenu3Line } from "react-icons/ri";
import { FiMessageCircle } from "react-icons/fi";
import Navbar from '../nav';

function Header() {
    const [showMobileNav, setShowMobileNav] = useState(false);
    const hideNav = useCallback(() => setShowMobileNav(false), []);
    
    return (
        <header 
            className="bg-primary text-white w-100 px-4 py-3 d-flex align-items-center justify-content-between shadow-sm"
            style={{ 
                position: 'sticky',
                top: 0,
                zIndex: 1050 // Higher than Offcanvas (which is 1040)
            }}
        >
            <h2 className="mb-0">Dashboard</h2>

            <div className="d-flex align-items-center gap-3">
                <FiMessageCircle size={24} />
                <RiMenu3Line 
                    size={24}
                    className="d-lg-none cursor-pointer"
                    onClick={() => setShowMobileNav(true)}
                />
            </div>

            <Offcanvas 
                show={showMobileNav} 
                onHide={hideNav}
                placement="start"
                className="w-75"
                style={{ zIndex: 1045 }} // Slightly below header
            >
                <Offcanvas.Header closeButton className='bg-primary text-white'>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0 bg-light">
                    <Navbar isMobile closeMobileNav={hideNav} />
                </Offcanvas.Body>
            </Offcanvas>
        </header>
    );
}

export default Header;