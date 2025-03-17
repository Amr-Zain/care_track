import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { cancelAppointment, updateAppointment } from "../../../features/appointments";
import { PROFILE } from "../../../constants/routes";

function DeleteUpdateModal({ 
  overlay: { id, type, appType, DoctorNurseId, name }, 
  setOverlay 
}) {
  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const { 
    appointmentUpdateLoading: isLoading, 
  } = useSelector(store => store.appointments);

  const handleClose = () => setOverlay({ show: false });

  const handleConfirm = async () => {
    try {
      if (type === 'delete') {
        await toast.promise(
          dispatch(cancelAppointment({ id })).unwrap(),
          {
            pending: 'Canceling appointment...',
            success: 'Appointment canceled successfully!',
            error: {
              render({data}) {
                return data||'Failed to cancel appointment';
              }
            }
          }
        );
      } else if (type === 'update') {
        await toast.promise(
          dispatch(updateAppointment({ id, date })).unwrap(),
          {
            pending: 'Updating appointment...',
            success: 'Appointment updated successfully!',
            error: {
              render({data}) {
                return data||'Failed to update appointment';
              }
            }
          }
        );
      }
      handleClose();
    } catch (error) {
      toast.error(error || 'An error occurred');
    }
  };

  return (
    <Modal
      show={true}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title as="h5">
          Confirm {type.charAt(0).toUpperCase() + type.slice(1)}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="py-4">
        <p className="mb-4">
          Do you want to {type} the appointment with{' '}
          <Link 
            to={`/${PROFILE}/${appType}/${DoctorNurseId}`}
            className="fw-bold underline-pointer text-dark"
          >
            {name}
          </Link>?
        </p>

        {type === 'update' && (
          <Form.Group className="mb-3">
            <DatePicker
              selected={date}
              onChange={date => setDate(date)}
              minDate={new Date()}
              showIcon
              closeOnScroll={true}
              placeholderText="Select Date"
              className="form-control"
              wrapperClassName="w-100"
            />
          </Form.Group>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0">
        <Button
          variant="secondary"
          onClick={handleClose}
          className="px-4 bg-white text-dark border-0"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={isLoading}
          className="px-4"
          style={{
            backgroundColor: type === 'delete' ? 'var(--bs-danger)' : 'var(--primary)',
            borderColor: type === 'delete' ? 'var(--bs-danger)' : 'var(--primary)'
          }}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Processing...
            </>
          ) : (
            type.charAt(0).toUpperCase() + type.slice(1)
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteUpdateModal;