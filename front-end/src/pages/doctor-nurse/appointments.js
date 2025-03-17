import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAppointments, setDate } from "../../features/appointments";
import { useDispatch, useSelector } from "react-redux";
import DoctorAppointments from "../../components/doctor/appointments";
import { Container, Card } from "react-bootstrap";
import { BsCalendar } from "react-icons/bs";

function Appointments() {
    const { date, appointments } = useSelector((store) => store.appointments);
    const dispatch = useDispatch();
    const handleDateChange = (newDate) => {
        console.log(new Date(newDate).getTime())
        dispatch(setDate({ date: new Date(newDate).getTime() }));
    };
    useEffect(() => {
        if(appointments.length ===0)dispatch(getAppointments({ date:new Date(date).getTime() }))
        document.title = 'Doctor-Appointments';
    }, [appointments.length, date, dispatch]);

    return (
        <Container className="py-4">
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h3 className="mb-0">Appointments Schedule</h3>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-center">
                        <DatePicker
                            selected={new Date(date)}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            placeholderText="Select appointments date"
                            className="form-control w-auto"
                            calendarClassName="border-0 shadow"
                            popperClassName="shadow"
                            showPopperArrow={false}
                            customInput={
                                <div className="input-group w-auto">
                                    <span className="input-group-text bg-primary text-white">
                                        <BsCalendar />
                                    </span>
                                    <input 
                                        className="form-control bg-white" 
                                        style={{ minWidth: '200px' }}
                                        value={new Date(date).toLocaleDateString()}
                                        placeholder="Select appointments date"
                                        readOnly  
                                    />
                                </div>
                            }
                        />
                    </div>
                <DoctorAppointments appointments={appointments}/>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Appointments;