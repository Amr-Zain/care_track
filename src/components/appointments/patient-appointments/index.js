
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Spinner, Alert } from "react-bootstrap";
import { getAppointments } from "../../../features/appointments";
import Appointment from "./patient-appointment";
import { APPOINTMENTS, PATIENT } from "../../../constants/routes";
import DeleteUpdateOverlay from "./delete-update-overlay";
import '../../../style/appointment.css'

const Appointments = ({ isAppPage }) => {
  const dispatch = useDispatch();
  const { appointments, isLoading, error } = useSelector((store) => store.appointments);
  const [overlay, setOverlay] = useState({ show: false, type: "", id: "", name: "" });

  const updateOverlay = useCallback((updates) => {
    setOverlay(state => ({ ...state, ...updates }));
  }, []);

  useEffect(() => {
    if(!appointments.length)dispatch(getAppointments({ date: null }));
  }, [appointments.length, dispatch]);

  const renderAppointmentsList = () => {
    if (isLoading) {
      return (
        <div className="loading-placeholder text-primary">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="m-5 p-5 text-center">
          Error: {error}. Please try again later.
        </Alert>
      );
    }

    if (appointments.length === 0) {
      return isAppPage && (
        <div className="no-appointments text-center m-5 p-5">
          There Are No Upcoming Appointments
        </div>
      );
    }

    return (
      <Row className={`${!isAppPage ? "flex-nowrap" : "justify-content-center justify-content-center "}`}>
        {appointments.map((app) => (
          <Appointment key={app.id} {...app} setOverlay={updateOverlay} />
        ))}
      </Row>
    );
  };


  return (
    <div className={isAppPage ? "" : "appointments-slider"}>
      {(appointments.length !== 0 || isLoading) && (
        <div className="title">
          <Link to={`/${PATIENT}/${APPOINTMENTS}`}>
            Upcoming Appointments
          </Link>
        </div>
      )}

      <div className="appointments-container">
          {renderAppointmentsList()}
      </div>
      
      {overlay.show && <DeleteUpdateOverlay setOverlay={updateOverlay} overlay={overlay} />}
    </div>
  );
};

export default Appointments;