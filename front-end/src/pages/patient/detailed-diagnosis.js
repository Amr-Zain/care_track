import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {  Alert, Spinner, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Diagnosis from "../../components/medical-history/diagnosis";
import Medicines from "../../components/medical-history/medicines";
import { getDiagnosis, selectDiagnosisById } from "../../features/medicalHistory";
import { PATIENT } from "../../constants/routes";

function DetailedDiagnosis() {
    const { diagnosisId, patientId } = useParams();
    const { userType,id:userId } = useSelector(state=>state.authedUser.user)
    const diagnosis = useSelector(selectDiagnosisById(diagnosisId));
    const { isLoading, error } = useSelector(state => state.medicalHistory.diagnosis);
    const dispatch = useDispatch();
    const id = userType ===PATIENT ? userId: patientId;
    useEffect(() => {
        document.title = 'Diagnosis Details';
        if(!diagnosis) dispatch(getDiagnosis({ type: 'diagnosis', diagnosisId, patientId:id }));
    }, [diagnosisId, patientId, dispatch, diagnosis, id]);

    if (isLoading) {
        return (
            <Card className="shadow-sm my-5">
                <Card.Body className="text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Loading diagnosis details...</p>
                </Card.Body>
            </Card>

        );
    }

    if (error) {
        return (
                <Alert variant="danger" className="text-center  my-5 p-5">
                    Error: {error}
                </Alert>
        );
    }

    if (!diagnosis) {
        return (
                <Alert variant="info" className="text-center my-5 p-5">
                    Diagnosis Not Found
                </Alert>
        );
    }

    return (
            <Row className="justify-content-center">
                <Col lg={10} xl={8}>
                    <Diagnosis {...diagnosis} isPage>
                        {diagnosis?.medicines?.length !== 0 ? (
                            <Medicines medicines={diagnosis.medicines} diagnosisId={diagnosisId}  patientId={diagnosis.patientId} />
                        ) : (
                            <p className="text-muted text-center mb-0">
                                No prescribed medications found
                            </p>
                        )}
                    </Diagnosis>
                </Col>
            </Row>
    );
}

export default DetailedDiagnosis;