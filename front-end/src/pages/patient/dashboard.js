import Appointments from "../../components/appointments/patient-appointments";
import SearchBar from "../../components/patient/search/search-bar";
import Populers from "../../components/popular";
import { useEffect } from "react";

function Dashboard() {
    useEffect(()=>{
        document.title = 'Patient-Dashboard';
    },[])
    return (
        < >
                <section className="search-section">
                    <SearchBar isOverlay={false}/>
                </section>
                <Appointments isAppPage={false} type ={ 'patient'}/>
                <Populers />
        
        </>
    );
}

export default Dashboard;