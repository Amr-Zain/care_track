import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/doctor/nav";
import Header from "../../components/doctor/header/index";
import Info from "../../components/doctor/total-appointments-info";
import { getTodayAppointments, setTotalPatients } from "../../features/appointments";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPatients } from "../../api/data";

function DoctorSharedLayout() {
    const dispatch = useDispatch();
    const { id, userType } = useSelector(store => store.authedUser.user);
    const {totalPatients, todayApps} = useSelector(store => store.appointments);
    
    const todayAppsCount = todayApps.length;

    const TotalPatientsInfo = <Info isTotal count={totalPatients} />

    const TodayAppointmentsInfo = <Info count={todayAppsCount} />

    useEffect(() => {
        dispatch(getTodayAppointments());
    }, [dispatch]);

    useEffect(() => {
        let isMounted = true;
        
        const fetchTotalPatients = async () => {
            try {
                const value = await getTotalPatients({ id, userType });
                if (isMounted) {
                    dispatch(setTotalPatients( value ));
                }
            } catch (error) {
                console.error("Failed to fetch total patients:", error);
            }
        };

        if (!totalPatients) {
            fetchTotalPatients();
        }

        return () => {
            isMounted = false;
        };
    }, [id, userType, totalPatients, dispatch]);

    return (
        <div className="d-flex flex-column vh-100">
            <Header />
            <div className="d-flex flex-grow-1">
                <div className="d-none d-lg-block" style={{ width: '22%' }}>
                    <Navbar />
                </div>
                <main className="flex-grow-1 p-4">
                    <section className="row g-3 mb-4">
                        <div className="col-12 col-md-6">
                            {TotalPatientsInfo}
                        </div>
                        <div className="col-12 col-md-6">
                            {TodayAppointmentsInfo}
                        </div>
                    </section>
                    <section className="row g-3 mb-4">
                        <Outlet />
                    </section>
                </main>
            </div>
        </div>
    );
}

export default DoctorSharedLayout;