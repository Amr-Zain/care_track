import { Card, Col, Row, Spinner } from "react-bootstrap"; // Added import
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPatientInfo } from "../../features/patient";
import { DEFAULT_IMG_URL } from "../../constants/default";
import { PATIENT } from "../../constants/routes";

function PatientInfo({ patientId }) {
    const {
        data: { image, name, age },
        isLoading,
        error
    } = useSelector(state => state.patient);
    const { user } = useSelector(store=>store.authedUser)
    const dispatch = useDispatch();

    useEffect(() => {
        if(user.userType === PATIENT) return;
        dispatch(getPatientInfo({ patientId }));
    }, [dispatch, patientId, user.userType]);

    if (isLoading) {
        return (
            <Card className="shadow-sm mt-5 p-4 bg-white"> 
                <Card.Body className="d-flex justify-content-center align-items-center p-4">
                    <div className="loading-placeholder">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return (
            <Card border="danger" className="hadow-sm mt-5 mb-3"> 
                <Card.Body className="text-danger">
                    <Card.Title>Error</Card.Title>
                    <Card.Text>{error}</Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card className="shadow-sm mt-5 p-4  bg-white"> 
            <Card.Body>
                <Row className="align-items-center"> 
                    <Col xs="auto"> 
                        <Card.Img
                            variant="top"
                            src={image || user.imageURL || DEFAULT_IMG_URL}
                            alt={name}
                            className="rounded-circle me-3"
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                cursor: 'pointer'
                            }}
                        />
                    </Col>
                    <Col>
                        <Card.Title className="mb-1">{user.userType ===PATIENT ? user.name :name}</Card.Title>
                        <Card.Text className="text-muted">
                            <span className="badge bg-light text-dark me-2">Age</span>
                            {user.userType ===PATIENT ? user.age :age} year
                        </Card.Text>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default PatientInfo;