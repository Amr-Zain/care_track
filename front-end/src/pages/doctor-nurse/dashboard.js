import {  useEffect } from 'react';
import DoctorAppointments from '../../components/doctor/appointments';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Container } from 'react-bootstrap';
import { getTodayAppointments } from '../../features/appointments';

function Dashboadrd() {
    const { todayApps } = useSelector((store) => store.appointments)
    const  dispatch = useDispatch();
    useEffect(()=>{
        if(todayApps.length ===0)dispatch(getTodayAppointments());
        document.title = 'Dashboard';
    },[dispatch, todayApps.length])
    return (
        <Container className="py-4">
        <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-primary text-white">
                <h3 className="mb-0">Today Appointments</h3>
            </Card.Header>
            <Card.Body>
                <DoctorAppointments appointments={todayApps}  />
            </Card.Body>
        </Card>
    </Container>);
}

export default Dashboadrd;
