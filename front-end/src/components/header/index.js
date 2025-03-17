import { 
APPOINTMENTS, 
BLOOD_BANK, 
MEDICAL_HISTORY, 
LOGIN 
} from '../../constants/routes';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeAuthedUser } from '../../features/authedUser';
import { deleteUserSession } from '../../api/data';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { BsBoxArrowRight } from 'react-icons/bs';

function Header() {
    const { user } = useSelector((state) => state.authedUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await deleteUserSession();
            dispatch(removeAuthedUser());
            navigate(`/${LOGIN}`);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!user) return null;

    // Style for active links
    const getActiveStyle = ({ isActive }) => ({
        fontWeight: isActive ? '600' : '400',
        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
        borderRadius: '0.25rem'
    });

    return (
        <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={NavLink} end to={`/${user.userType}`} className="d-flex align-items-center">
                    <img 
                        src='/images/logo-white.png' 
                        alt="App Logo" 
                        style={{ height: '3rem', width: 'auto' }}
                        className="me-2"
                    />
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="main-navbar" />
                
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link 
                            as={NavLink}
                            end
                            to={`/${user.userType}`} 
                            style={getActiveStyle}
                            className="text-white mx-1"
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link 
                            as={NavLink}
                            to={`/${user.userType}/${BLOOD_BANK}`} 
                            style={getActiveStyle}
                            className="text-white mx-1"
                        >
                            Blood Bank
                        </Nav.Link>
                        <Nav.Link 
                            as={NavLink}
                            to={`/${user.userType}/${MEDICAL_HISTORY}`} 
                            style={getActiveStyle}
                            className="text-white mx-1"
                        >
                            Medical History
                        </Nav.Link>
                        <Nav.Link 
                            as={NavLink}
                            to={`/${user.userType}/${APPOINTMENTS}`} 
                            style={getActiveStyle}
                            className="text-white mx-1"
                        >
                            Appointments
                        </Nav.Link>
                    </Nav>
                    
                    <div className="d-flex align-items-center">
                        <span className="text-white me-3 d-none d-lg-block">{user.name}</span>
                        <Button 
                            variant="outline-light" 
                            onClick={handleLogout}
                            className="d-flex align-items-center"
                        >
                            <BsBoxArrowRight className="me-2" />
                            Logout
                        </Button>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;