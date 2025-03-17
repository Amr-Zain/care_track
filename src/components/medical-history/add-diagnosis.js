import MedicineInputs from "./medicine-inputs";
import { MdAdd } from 'react-icons/md'
import { useDispatch, useSelector } from "react-redux";
import { addFormMedicine,  setFormError, setFromDescription } from "../../features/diagnosisForm";
import { createDiagnosis } from "../../features/medicalHistory";
import { Form, Button, Alert, Spinner, Card, Container } from "react-bootstrap";
import { toast } from "react-toastify";

function AddDiagnosis({ patientId }) {
    const { description, error, medicines, isLoading } = useSelector(state => state.diagnosisForm);
    const MedicinedList = medicines.map((med) => <MedicineInputs key={med.id} id={med.id} {...med} />);
    const dispatch = useDispatch();

   
    const handleSubmitDiagnosis = async (e) => {
        e.preventDefault();
        if (medicines.every(med => (med.name && med.dose && med.duration)) && description) {
            dispatch(setFormError(''));
            try {
                await toast.promise(
                    dispatch(createDiagnosis({ description, medicines, patientId })).unwrap(),
                    {
                        pending: 'Submitting The Diagnosis...',
                        success: 'Submitted The Diagnosis Successfully',
                        error: {
                            render({ data }) {
                                // Handle different error formats
                                return data|| 
                                        data?.message || 
                                        'Something Went Wrong, Please Try Again';
                            }
                        }
                    }
                );
                // Clear form on success
                dispatch(setFromDescription(''));
            } catch (error) {
                // Error already handled by toast
            }
        } else {
            const errorMsg = 'Please fill out all medicine fields first';
            dispatch(setFormError(errorMsg));
            toast.error(errorMsg);
        }
    };


    const addMedicineHandler = () => {
        dispatch(addFormMedicine());
    };

    return (
        <Container className="my-4">
            <Card className="shadow-sm bg-white">
                <Card.Body>
                    <Form onSubmit={handleSubmitDiagnosis}>
                        <Card.Title className="mb-4">Add New Diagnosis</Card.Title>

                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                        
                        <Form.Group className="mb-4" controlId="diagnosisDescription">
                            <Form.Label>Diagnosis Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={description}
                                placeholder="Enter diagnosis description..."
                                onChange={(e) => dispatch(setFromDescription(e.target.value))}
                            />
                        </Form.Group>

                        {medicines.length > 0 && (
                            <Card className="mb-4">
                                <Card.Header as="h5">Medicines</Card.Header>
                                <Card.Body >
                                    <div className="row g-3">
                                        {MedicinedList}
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        <Button
                            variant="outline-primary"
                            className="mb-4 d-flex align-items-center gap-2"
                            onClick={addMedicineHandler}
                            type="button"
                        >
                            <MdAdd /> Add Medicine
                        </Button>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100" 
                            disabled={isLoading}
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
                                    <span className="ms-2">Submitting...</span>
                                </>
                            ) : (
                                'Submit Diagnosis'
                            )}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AddDiagnosis;