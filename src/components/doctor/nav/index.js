import { Container, Nav, Button, Row, Col } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import DoctorInfo from "./doctorInfo";
import { APPOINTMENTS, LOGIN, PROFILE, SETTINGS } from "../../../constants/routes";
import { MdLogout, MdSpaceDashboard } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserSession } from './../../../api/data';
import { MdSchedule } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { removeAuthedUser } from "../../../features/authedUser";
import { FaUser } from "react-icons/fa";
import NavItem from './navItem';

function Navbar({ isMobile= false, closeMobileNav}) {
    const dispatch = useDispatch();
    const { userType, id } = useSelector(state => state.authedUser.user)
    
    const logoutHandler = async () => {
        await deleteUserSession();
        dispatch(removeAuthedUser());
        return <Navigate to={'/' + LOGIN} replace />;
    }

    return (
        <Container fluid className={`h-100 bg-white ${!isMobile && 'border-end'}`}>
            <Row className={`h-100  w-100 m-auto ${isMobile ? 'g-0' : 'p-3 pt-4 '}`}>
                <Col lg={3} className={`h-100 w-100 ${isMobile ? 'p-3' : ''}`}>
                    {!isMobile && <DoctorInfo className="mb-5" />}
                    <Nav as="nav" className="flex-column gap-2 my-4">
                        <NavItem closeMobileNav={closeMobileNav} to={`/${userType}`}>
                            <MdSpaceDashboard className="me-2" />
                            Dashboard
                        </NavItem>

                        <NavItem closeMobileNav={closeMobileNav} to={`/${userType}/${APPOINTMENTS}`}>
                            <MdSchedule className="me-2" />
                            Appointments
                        </NavItem>

                        <NavItem closeMobileNav={closeMobileNav} to={`/${PROFILE}/${userType}/${id}`}>
                                <FaUser className="me-2" />
                                Profile
                        </NavItem>

                        <NavItem closeMobileNav={closeMobileNav} to={`/${userType}/${SETTINGS}`}>
                            <IoSettings className="me-2" />
                            Settings
                        </NavItem>

                        <Nav.Item>
                            <Button 
                                variant="link" 
                                onClick={logoutHandler}
                                className="text-dark text-decoration-none px-3 py-2"
                            >
                                <MdLogout className="me-2" />
                                Logout
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>
        </Container>
    );

}

export default Navbar;