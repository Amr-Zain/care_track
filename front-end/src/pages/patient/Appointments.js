import AppComponents from '../../components/appointments/patient-appointments';
import { useEffect } from 'react';
const Appointments = ()=>{
    useEffect(()=>{
        document.title = 'Appointments';
    },[])
    return(<>
        <AppComponents isAppPage />
    </>
    );
}

export default Appointments;