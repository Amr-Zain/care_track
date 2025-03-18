import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ResultCard from "../patient/search/result-card";
import AppPicker from "../doctor-schedule/appointment-picker";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment, getProfile, setAppointmentTime, setClinic, setError, setInitShecheduleDate } from "../../features/profile";
import { DOCTOR, NURSE, PATIENT } from "../../constants/routes";
import '../../style/search.css'
import { toast } from "react-toastify";
function Profile() {
    const dispatch = useDispatch();
    const { profileData, clinic: { id:clinicId, initShecheduleDate, appointmentTime }, isLoading, error } = useSelector(state => state.profile);
    const { userType, id } = useParams();
    const { userType: authedUserType } = useSelector(state => state.authedUser.user)
    const changeClinicHandler = (item) => {
        if (clinicId !== item.id)
            dispatch(setClinic({ clinic: item }))
    }

    const dateChangeHandler = (initDate) => {
        const date = new Date(initDate);
        date.setHours(9,0,0,0);
        if (userType === NURSE) dispatch(setAppointmentTime({ appointmentTime: date}))
        dispatch(setInitShecheduleDate({ initDate: date }))
    }

    const SubmitHandler = async (e) => {
        e.preventDefault();
        if(!appointmentTime) {
            const message = userType === DOCTOR? 'Please Choose A Clinic And The Apointment Date First':'Please Choose The Apointment Date First'
            dispatch(setError(message))
            return;
        }
        try{
            await toast.promise(
                dispatch(bookAppointment({ date: appointmentTime, type: userType, doctorId: id, nurseId: id, clinicId })).unwrap(),
            {
                pending:'Booking The Appointment...',
                success:'The Appointment Booked Successfully.',
                error: {
                    render({ data }) {
                        console.log("Toast error data:", data); 
                        return data?.payload || 'Something Went Wrong, Please Try Again.';
                    }
                }
            })
        }catch(e){
            //handled in the toaster
        }
    }

    useEffect(() => {
        dispatch(getProfile({ id, userType }));
    }, [dispatch, id, userType]);

    if (profileData.isLoading) return (
        <div className="d-flex justify-content-center align-items-center my-5 " style={{minHeight:'50vh'}}>
            <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );

    if (profileData.error) return (
        <Alert variant="danger" className="m-4">
            Error: {profileData.error}
        </Alert>
    );
    if(!profileData.id){
        return(
            <div className=" my-5 " style={{minHeight:'30vh'}}>
            <Alert variant="info" className="text-center">
                Profile Not Found.
            </Alert>
        </div>)
    }

    return (
            <Row>
                <Col md={12} lg={8} className="mx-auto my-3">
                    <ResultCard isPage type={userType} {...profileData} />
                    
                    <Form onSubmit={SubmitHandler} className="mt-4 shadow-sm rounded">
                        <Card>
                            <Card.Header as="h4" className="bg-primary text-white">
                                Book An Appointment
                            </Card.Header>
                            
                            <Card.Body className="bg-white">
                                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                                {authedUserType !==PATIENT&&<Alert variant="danger" className="mt-3">Sign Up As Patinet To Book An Appointment</Alert>}
                                {userType === DOCTOR && (
                                    <Form.Group className="mb-4">
                                        <Form.Label>Select Clinic</Form.Label>
                                        <Select
                                            options={profileData.clinics}
                                            placeholder="Choose clinic"
                                            onChange={changeClinicHandler}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                        />
                                    </Form.Group>
                                )}

                                {(clinicId || userType === NURSE) && (
                                    <Form.Group className="mb-4">
                                        <Form.Label>Select Date</Form.Label>
                                        <br/>
                                        <DatePicker
                                            selected={initShecheduleDate}
                                            onChange={dateChangeHandler}
                                            minDate={new Date(new Date().setHours(9))}
                                            className="form-control bg-white"
                                            popperPlacement="auto"
                                            placeholderText="Select Date"
                                            showIcon
                                            required
                                        />
                                    </Form.Group>
                                )}

                                {userType === DOCTOR && <AppPicker doctorId={id} />}
                                <div className="d-grid gap-2 mt-4">
                                    <Button 
                                        variant="primary" 
                                        type="submit"
                                        size="lg"
                                        disabled={isLoading || authedUserType !== PATIENT}
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
                                        ) : 
                                        "Book Appointment"
                                        }
                                    </Button>
                                </div>
                                
                            </Card.Body>
                        </Card>
                    </Form>
                </Col>
            </Row>
    );
}

export default Profile;