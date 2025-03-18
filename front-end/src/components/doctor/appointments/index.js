import { useSelector } from "react-redux";
import Patient from "./patient";
import { Alert, Card, Spinner } from "react-bootstrap";
function DoctorAppointments({appointments}) {
    const {  isLoading, error } = useSelector(state => state.appointments);
    const Appointments = appointments?.map(app => (
        <div key={app.id} className="col-12">
            <Patient {...app} />
        </div>
    ));

    return (
        <Card.Body>
                {error && (
                    <Alert variant="danger" className="text-center">
                        {error}
                    </Alert>
                )}
                {isLoading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    Appointments.length ===0 && !error? 
                        <div className="text-center">NO Appointmets Found</div>
                        : 
                        <div style={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            {Appointments}
                        </div>
                )}
            </Card.Body>

    );
}

export default DoctorAppointments;
      