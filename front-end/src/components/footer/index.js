import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaUserMd, 
  FaUserNurse, 
  FaCalendarAlt, 
  FaCog, 
  FaInfoCircle, 
  FaQuestionCircle 
} from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

import { HiOutlineMail } from "react-icons/hi";
import { BsTelephoneFill } from "react-icons/bs";
import { Col, Container, Row } from 'react-bootstrap';
import { 
  PATIENT, 
  APPOINTMENTS, 
  SEARCH,
  DOCTOR,
  NURSE,
  MEDICAL_HISTORY
} from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-5 mt-5">
      <Container>
        <Row className="g-4">
          <Col md={6} lg={4} className="">
            <div className="d-flex flex-column align-items-center align-items-lg-start">
              <Link to="/" className='mx-auto'>
                <img 
                  src='/images/logo-white.png' 
                  alt="Company Logo"
                  className="img-fluid mb-3"
                  style={{ maxWidth: '170px'}}
                />
              </Link>
              <p className="text-center mx-auto text-lg-start">
                Your trusted partner in healthcare solutions
              </p>
            </div>
          </Col>

          <Col md={6} lg={4} className="">
            <Row>
              <Col xs={6}>
              <div className='mx-auto' style={{width:'fit-content'}}>
                <h5 className="mb-3 ">Search</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to={`/${PATIENT}/${SEARCH}?searchFor=${DOCTOR}`} className="text-white text-decoration-none hover-text-primary">
                      <FaUserMd className="me-2" />
                      Doctor
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to={`/${PATIENT}/${SEARCH}?searchFor=${NURSE}`} className="text-white text-decoration-none hover-text-primary">
                      <FaUserNurse className="me-2" />
                      Nurse
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to={`/${PATIENT}/${SEARCH}?searchFor=donation_request`} className="text-white text-decoration-none hover-text-primary">
                      <MdBloodtype className="me-2" />
                      Blood Request
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to={`/${PATIENT}/${SEARCH}?searchFor=donator`} className="text-white text-decoration-none hover-text-primary">
                      <MdBloodtype className="me-2" />
                      Blood Donator
                    </Link>
                  </li>
                </ul>
              </div>

              </Col>

              <Col xs={6}>
              <div className='mx-auto' style={{width:'fit-content'}}>
                <h5 className="mb-3">Useful Links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to={`/${PATIENT}/${APPOINTMENTS}`} className="text-white text-decoration-none hover-text-primary">
                      <FaCalendarAlt className="me-2" />
                      Appointments
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to={`/${PATIENT}/${MEDICAL_HISTORY}`} className="text-white text-decoration-none hover-text-primary">
                      <FaQuestionCircle className="me-2" />
                      Medical History
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/settings" className="text-white text-decoration-none hover-text-primary">
                      <FaCog className="me-2" />
                      Settings
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/about" className="text-white text-decoration-none hover-text-primary">
                      <FaInfoCircle className="me-2" />
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              </Col>
            </Row>
          </Col>

          <Col md={12} lg={4} className="d-none d-md-block">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FaHome className="me-3" size={20} />
                <span>Cairo, EG</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <HiOutlineMail className="me-3" size={20} />
                <a href="mailto:info@example.com" className="text-white text-decoration-none">
                  info@example.com
                </a>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <BsTelephoneFill className="me-3" size={20} />
                <a href="tel:+0123456788" className="text-white text-decoration-none">
                  +01 234 567 88
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <div className="text-center py-3 border-top mt-1">
          <small>
            &copy; {new Date().getFullYear()} Healthcare App. All rights reserved.
          </small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;