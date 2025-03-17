import { Controller, useForm } from "react-hook-form";
import { createClinic } from "../../../api/data";
import { useState } from "react";
import { Button, Form, Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import Select from "react-select";
import { cities } from '../../../api/api';


function ClinicForm() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            clinicName: "",
            clinicPhone: "",
            city: null,
            clinicLocation: "",
        }
    });

    const [clinicStatus, setClinicStatus] = useState({ isLoading: false, error: '' });

    const addClinic = async (data) => {
        try {
            setClinicStatus({ isLoading: true, error: null });
            console.log(data)
            await createClinic(data);
            setClinicStatus({ isLoading: false, error: null });
            reset();
            alert("Clinic created successfully!");
        } catch (error) {
            console.error("Clinic creation failed: ", error);
            setClinicStatus({ isLoading: false, error: error.message || "An error occurred." });
        }
    };
    return (
        <Container fluid className="py-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Form onSubmit={handleSubmit(addClinic)}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Enter clinic name"
                                isInvalid={!!errors.clinicName}
                                className="bg-white"
                                {...register("clinicName", {
                                    required: "Clinic Name Is Required",
                                    setValueAs: value => value.replace(/\s+/g, ' ').trim()
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.clinicName?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="tel"
                                placeholder="Enter phone number"
                                isInvalid={!!errors.clinicPhone}
                                className="bg-white"
                                {...register("clinicPhone", {
                                    required: "Clinic Phone is required",
                                    pattern: {
                                        value: /^01[0-9]{9}$/,
                                        message: "Invalid phone number"
                                    }
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.clinicPhone?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Controller
                                name="city"
                                control={control}
                                rules={{ required: "City is required" }}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <Select
                                            {...field}
                                            placeholder="Choose City"
                                            options={cities}
                                            isClearable
                                            classNamePrefix="select"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderColor: error ? '#dc3545' : '#ced4da',
                                                    '&:hover': {
                                                        borderColor: error ? '#dc3545' : '#ced4da'
                                                    }
                                                })
                                            }}
                                        />
                                        {error && (
                                            <Form.Text className="text-danger">
                                                {error.message}
                                            </Form.Text>
                                        )}
                                    </>
                                )}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter clinic address"
                                isInvalid={!!errors.clinicLocation}
                                className="bg-white"
                                {...register('clinicLocation', {
                                    required: "Clinic Location is required",
                                })}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.clinicLocation?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={clinicStatus.isLoading}
                            >
                                {clinicStatus.isLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="ms-2">Loading...</span>
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </div>

                        {clinicStatus.error && (
                            <Alert variant="danger" className="mt-3">
                                {clinicStatus.error}
                            </Alert>
                        )}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ClinicForm;