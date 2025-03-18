import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import { getDiagnosis, changeFilterCategory, 
    setFilterByDoctor, setFilterDate } from '../../features/medicalHistory';
import Diagnosis from "./diagnosis";
import Select from 'react-select';
import { FiSearch } from "react-icons/fi";

const dates = [
    { value: 0, label: 'Last 6 Months' },
    { value: 1, label: 'Last Year' },
    { value: 2, label: 'Last 2 Years' },
    { value: 3, label: 'All' },
];

export default function DiagnosisList({ patientId }) {
    const dispatch = useDispatch();
    const { 
        medicalHistory: { 
            diagnosis: { data: diagnosis, patientDiagnosisCategories, isLoading, error }, 
            filters: { date, selectedCategories, byDoctor }
        },
        authedUser: { 
            user: { userType }
        } 
    } = useSelector(store => store);

    const handleCategChange = (items) => {
        dispatch(changeFilterCategory({ categories: items?.map(i => i?.label) }));
    }

    const handleSearch = () => {
        dispatch(getDiagnosis({ type: 'diagnosisList', patientId, diagnosisId: null }));
    }

    useEffect(() => {
        dispatch(getDiagnosis({ type: 'categories', patientId, diagnosisId: null }));
    }, [dispatch, patientDiagnosisCategories.length, patientId]);

    const renderDiagnosis = () => {
        if (isLoading) {
            return (
                <div className="text-center my-5 text-primary">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }

        if (error) {
            return <Alert variant="danger" className="my-4">Error: {error}</Alert>;
        }
    
        return (
            <Row xs={1} md={2} lg={3} className="g-4">
                {diagnosis.map(diag => (
                    <Col key={diag.id}>
                        <Diagnosis {...diag} />
                    </Col>
                ))}
            </Row>
        );
    }

    return (
        <>
            <Card className="shadow-sm mb-4  bg-white">
                <Card.Body>
                    <Row className="g-3 justify-content-center align-items-end">
                        <Col xs={12} md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Specializations</Form.Label>
                                <Select
                                    isMulti
                                    options={patientDiagnosisCategories}
                                    onChange={handleCategChange}
                                    value={patientDiagnosisCategories.filter(option => 
                                        selectedCategories.includes(option.label)
                                    )}
                                    classNamePrefix="react-select"
                                    placeholder="Specializations..."
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Time Range</Form.Label>
                                <Select
                                    options={dates}
                                    onChange={(item) => dispatch(setFilterDate({ date: item.value }))}
                                    value={dates.find(option => date === option.value)}
                                    classNamePrefix="react-select"
                                    placeholder="time range..."
                                />
                            </Form.Group>
                        </Col>
                        {userType === 'doctor' && (
                            <Col xs={12} md={6} lg={3}>
                                <Form.Group>
                                    <Form.Check 
                                        type="checkbox"
                                        label="Show only my diagnoses"
                                        checked={byDoctor}
                                        onChange={(e) => dispatch(setFilterByDoctor({ byDoctor: e.target.checked }))}
                                    />
                                </Form.Group>
                            </Col>
                        )}
                        <Col xs={12} md={6} lg={3}>
                        <Button 
                                variant="primary" 
                                type="submit" 
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="w-100"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="ms-2">Loading...</span>
                                    </>
                                ) : (<>
                                    <FiSearch className="me-2" />
                                    Search
                                    </>
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {!diagnosis.length&& !error &&<Col>
                <Alert variant="info" className="text-center">
                    No results found please choose different date range
                </Alert>
            </Col>}
            {renderDiagnosis()}
        </>
    );
}