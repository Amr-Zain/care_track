import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';

const BloodCard = ({ id, name, bloodType, city, email, date }) => {
    const navigate = useNavigate();

    return (
        <Col md={12} lg={6} className="mb-4">
            <Card className="h-100 shadow-sm hover-shadow  bg-white">
                <Card.Body className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-start">
                        <Card.Title className="mb-0 fs-4">
                            {name}
                            <Badge bg="danger" className="ms-2">
                                {bloodType}
                            </Badge>
                        </Card.Title>
                    </div>

                    <Card.Text className="text-muted">
                        <p>{city}</p>
                        <small>Donation Day:</small> {new Date(date).toDateString()}
                    </Card.Text>

                    <Row className="g-2 mt-2">
                        <Col xs={6}>
                            <Button 
                                variant="outline-primary" 
                                className="w-100 d-flex align-items-center gap-2 underline-pointer"
                                href={`mailto:${email}`}
                            >
                                <MdEmail className="text-primary" />
                                <span className="d-inline">Email</span>
                            </Button>
                        </Col>
                        <Col xs={6}>
                            <Button 
                                variant="primary" 
                                className="w-100 d-flex align-items-center gap-2"
                                onClick={(e) => {
                                    navigate('chat/' + id);
                                }}
                            >
                                <BsFillChatDotsFill />
                                <span className="d-inline">Chat</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
};

export default BloodCard;