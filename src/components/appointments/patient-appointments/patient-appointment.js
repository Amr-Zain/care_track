import { useNavigate } from "react-router-dom";
import { PROFILE } from "../../../constants/routes";
import { RiDeleteBin5Line, RiStethoscopeLine } from "react-icons/ri";
import { BiMoney } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { Card, Col, Row } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import { DEFAULT_IMG_URL } from "../../../constants/default";
import { dateFormatter } from "../../../api/helper";

const Appointment = ({ 
    userType, 
    id, 
    image, 
    name, 
    date, 
    rating, 
    DoctorNurseId, 
    specialization, 
    location, 
    fees, 
    from, 
    to, 
    setOverlay 
}) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate(`/${PROFILE}/${userType}/${DoctorNurseId}`);
    };

    return (
        <Col xs={12} sm={6} md={6} lg={4} className="mb-4" style={{ maxWidth: '320px',minWidth:'fit-content' }}>
            <Card className="h-100 shadow-sm bg-white">
                <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-3">
                        <Card.Img
                            variant="top"
                            src={image || DEFAULT_IMG_URL}
                            alt={`${userType === 'doctor' ? 'Dr.' : ''} ${name}`}
                            className="rounded-circle me-3 flex-shrink-0"
                            style={{ 
                                width: '80px', 
                                height: '80px', 
                                objectFit: 'cover' 
                            }}
                            onClick={handleProfileClick}
                        />
                        <div className="flex-grow-1 min-w-0" style={{width:'175px'}}> 
                            <Card.Title 
                                className="mb-0 text-truncate text-dark underline-pointer"
                                onClick={handleProfileClick}
                            >
                                <span className="d-block text-truncate">
                                    {`${userType === 'doctor' ? 'Dr.' : 'Nurse'} ${name}`}
                                </span>
                            </Card.Title>
                            <small className="text-muted text-truncate d-block">
                                {dateFormatter(new Date(date))}
                            </small>
                            <div className="d-flex align-items-center mt-1">
                                <AiFillStar className="text-warning me-1 flex-shrink-0" />
                                <span className="text-muted">{Number(rating).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-3 min-w-0">
                        {userType === 'doctor' && (
                            <Row className="mb-2">
                                <Col xs={12}>
                                    <div className="d-flex align-items-center text-secondary">
                                        <RiStethoscopeLine className="me-2 flex-shrink-0" />
                                        <small className="text-truncate d-block">
                                            {specialization}
                                        </small>
                                    </div>
                                </Col>
                            </Row>
                        )}
                        
                        <Row className="g-2">
                            <Col xs={12}>
                                <div className="d-flex align-items-center text-secondary">
                                    <MdLocationPin className="me-2 text-danger flex-shrink-0" />
                                    <small className="text-truncate d-block">
                                        {location}
                                    </small>
                                </div>
                            </Col>
                            <Col xs={12}>
                                <div className="d-flex align-items-center text-secondary">
                                    <BiMoney className="me-2 text-success flex-shrink-0" />
                                    <small className="text-truncate d-block">
                                        ${fees}
                                    </small>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="mt-auto d-flex justify-content-between align-items-center min-w-0">
                        <div className="d-flex gap-2">
                            <FiEdit 
                                className="text-primary action-icon" 
                                onClick={() => setOverlay({ 
                                    show: true, 
                                    type: 'update', 
                                    id, 
                                    name, 
                                    DoctorNurseId, 
                                    appType: userType 
                                })}
                            />
                            <RiDeleteBin5Line 
                                className="text-danger action-icon"
                                onClick={() => setOverlay({
                                    show: true,
                                    type: 'delete',
                                    id,
                                    name,
                                    DoctorNurseId,
                                    appType: userType
                                })}
                            />
                        </div>
                        {userType === 'doctor'&& from && (
                            <small className="text-muted text-truncate" style={{ maxWidth: '100px' }}>
                                {from} - {to}
                            </small>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default Appointment;