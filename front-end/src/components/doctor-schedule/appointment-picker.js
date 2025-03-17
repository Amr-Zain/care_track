import { useEffect } from "react";
import { Col, Card, Alert } from 'react-bootstrap';
import { AppointmentPicker } from "react-appointment-picker";
import { useDispatch, useSelector } from "react-redux";
import { getClinicAppointments, setAppointmentTime } from "../../features/profile";
import { parseDateTime } from "../../api/helper";

function AppPicker() {
    const {
        clinic:{ 
            shecheduleDay, 
            location, 
            initShecheduleDate, 
            id,  
            isLoading, 
    },
    profileData:{appointmentTime:appointmentPeriod}
} = useSelector(state => state.profile);

    const dispatch = useDispatch();

    const addAppointmentCallback = ({
        addedAppointment: { day, number, time, id },
        addCb,
        removedAppointment: params,
        removeCb
    }) => {
        if(removeCb) removeCb(params.day, params.number);
        addCb(day, number, time, id);
        const date = parseDateTime(day, time)
        console.log(date)
        dispatch(setAppointmentTime({ appointmentTime: date }));
    };
    const removeAppointmentCallback = ({ day, number }, removeCb) => {
        removeCb(day, number);
    };
   
    useEffect(() => {
        if(id && initShecheduleDate){
            dispatch(getClinicAppointments({ date: new Date(initShecheduleDate).getTime(), clinicId:id }));
        }
    }, [id, initShecheduleDate,location, dispatch]);
    return (
                <Col xs={12}>

                    {location && !isLoading && (
                        <Card className="mb-3 shadow-sm">
                            <Card.Body className="py-2">
                                <h5 className="mb-0 text-center text-primary">
                                    {location}
                                </h5>
                            </Card.Body>
                        </Card>
                    )}
                    {shecheduleDay.every(day=>!day.length) && id && <Alert variant="danger" className="text-center">This Clinic Has No Schedule For This Range try Other Date</Alert> }
                    <div className="d-flex justify-content-center mt-3">
                        <AppointmentPicker
                            addAppointmentCallback={addAppointmentCallback}
                            removeAppointmentCallback={removeAppointmentCallback}
                            initialDay={new Date(initShecheduleDate)}
                            unitTime={appointmentPeriod * 60 * 1000}
                            days={shecheduleDay}
                            className="appointment-picker-with-offset"
                            maxReservableAppointments={1}
                            local="en-IN"
                            visible
                            loading={isLoading}
                            continuous
                        />
                    </div>
                </Col>
    );
}

export default AppPicker;