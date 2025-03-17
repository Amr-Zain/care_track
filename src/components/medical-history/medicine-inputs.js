import { RiDeleteBin5Line } from 'react-icons/ri';
import { deleteFormMedicine, setFormMedicine } from '../../features/diagnosisForm';
import { useDispatch } from 'react-redux';
import { Form, Row, Col, Button } from 'react-bootstrap';

function MedicineInputs({ id, name, dose, duration, description }) {
    const dispatch = useDispatch();
    
    const medicineChange = (e) => {
        dispatch(setFormMedicine({ id, name: e.target.name, value: e.target.value }));
    };

    const handleDeleteMedicine = () => {
        dispatch(deleteFormMedicine({ id }));
    };

    return (
        <Row className="mb-3 g-2 align-items-center">
            <Col md={3}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        className='bg-white'
                        placeholder="Medicine Name"
                        onChange={medicineChange}
                    />
                </Form.Group>
            </Col>

            <Col md={2}>
                <Form.Group>
                    <Form.Control
                        type="number"
                        min='1'
                        name="dose"
                        className='bg-white'
                        value={dose}
                        placeholder="Dosage(D)"
                        onChange={medicineChange}
                    />
                </Form.Group>
            </Col>

            <Col md={2}>
                <Form.Group>
                    <Form.Control
                        type="number"
                        min='1'
                        name="duration"
                        className='bg-white'
                        value={duration}
                        placeholder="Duration(D)"
                        onChange={medicineChange}
                    />
                </Form.Group>
            </Col>

            <Col md={4}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        name="description"
                        className='bg-white'
                        value={description}
                        placeholder="Additional description"
                        onChange={medicineChange}
                    />
                </Form.Group>
            </Col>

            <Col md={1}>
                <Button 
                    variant="outline-danger" 
                    onClick={handleDeleteMedicine}
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: '100%' }}
                >
                    <RiDeleteBin5Line />
                </Button>
            </Col>
        </Row>
    );
}

export default MedicineInputs;