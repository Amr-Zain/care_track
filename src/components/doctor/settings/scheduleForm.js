import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import Select from "react-select";
import { Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { MdAdd, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorClinics } from "../../../features/profile";
import { toast } from "react-toastify";
import { postClinicSchedule } from "../../../api/data";
import { days } from "../../../api/api";



const hours = Array.from({ length: 24 }, (_, i) => ({ value: i, label: `${i<10?'0':''}${i}:00:00` }));

function ClinicScheduleForm() {
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            clinic: null,
            days: [],
        }
    });
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const { fields, append, remove } = useFieldArray({
        control,
        name: "days"
    });
    const clinics = useSelector(store=>store.profile.profileData.clinics)
    const watchedDays = watch("days");
    const clinic = watch("clinic");

    useEffect(() => {
        dispatch(getDoctorClinics())
    }, [dispatch]);

    
    const onSubmit = async(data) => {
        setSubmitError(null);
        setIsSubmitting(true);
        
        try {
            const formattedData = {
                clinicId: data.clinic.id,
                days: data.days.map(day => ({
                    day: day.day.value,
                    from: day.from.label,
                    to: day.to.label
                }))
            };
            await toast.promise(
                postClinicSchedule(formattedData),
                {
                    pending: 'Saving schedule...',
                    success: 'Schedule saved successfully!',
                    error: {
                        render({ data: error }) {
                            const message = error?.response?.data?.message || 
                                        error?.message || 
                                        'Failed to save schedule';
                            setSubmitError(message);
                            return message;
                        }
                    }
                }
            );
        } catch (error) {
            // Error is already handled by toast.promise
        } finally {
            setIsSubmitting(false);
        }
    };

    return ( 
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            {submitError && (
                <Alert variant="danger" className="mb-4">
                    {submitError}
                </Alert>
            )}
            <div className="mb-4">
                <Controller
                    name="clinic"
                    control={control}
                    rules={{ required: "Clinic selection is required" }}
                    render={({ field, fieldState: { error } }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Select Clinic"
                                options={clinics}
                                isClearable
                                className="basic-single"
                                classNamePrefix="select"
                            />
                            {error && <span className="text-danger small">{error.message}</span>}
                        </>
                    )}
                />
            </div>

            <div className="mb-4">
                {clinic&&<h5 className="mb-1">Working Hours</h5>}
                {fields.map((field, index) => (
                    <div key={field.id} className="mb-3 p-3 bg-light border rounded">
                        <Row className="g-3">
                            <Col md={4} >
                                <Controller
                                    name={`days.${index}.day`}
                                    control={control}
                                    rules={{ required: "Day is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={days}
                                            placeholder="Select Day"
                                            isClearable
                                            isOptionDisabled={(option) => 
                                                watchedDays.some((day, idx) => 
                                                    idx !== index && day?.day?.value === option.value
                                                )
                                            }
                                        />
                                    )}
                                />
                                {errors.days?.[index]?.day && (
                                    <span className="text-danger small">
                                        {errors.days[index].day.message}
                                    </span>
                                )}
                            </Col>

                            <Col md={3}>
                                <Controller
                                    name={`days.${index}.from`}
                                    control={control}
                                    rules={{ required: "Start time is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={hours}
                                            placeholder="From"
                                            isClearable
                                        />
                                    )}
                                />
                                {errors.days?.[index]?.from && (
                                    <span className="text-danger small">
                                        {errors.days[index].from.message}
                                    </span>
                                )}
                            </Col>

                            <Col md={3}>
                                <Controller
                                    name={`days.${index}.to`}
                                    control={control}
                                    rules={{ 
                                        required: "End time is required",
                                        validate: value => 
                                            value.value > watchedDays[index]?.from?.value || 
                                            "End time must be after start time"
                                    }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            options={hours}
                                            placeholder="To"
                                            isClearable
                                        />
                                    )}
                                />
                                {errors.days?.[index]?.to && (
                                    <span className="text-danger small">
                                        {errors.days[index].to.message}
                                    </span>
                                )}
                            </Col>

                            <Col md={2}>
                                <Button
                                    variant="danger"
                                    onClick={() => remove(index)}
                                    className="w-100"
                                >
                                    <MdDelete />
                                </Button>
                            </Col>
                        </Row>
                    </div>
                ))}

               {clinic&&<Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2"
                    type="button"
                    onClick={() => append({ day: null, from: null, to: null })}
                    disabled={fields.length >= 7}
                >
                    <MdAdd /> Add Day
                </Button>}
            </div>

            <Button 
                type="submit" 
                variant="primary" 
                className="w-100"
                disabled={isSubmitting}
            >
            {isSubmitting ? (
                <>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <span className="ms-2">Saving...</span>
                </>
                ) : (
                    "Save Schedule"
                )}
            </Button>
        </form>
    );
}

export default ClinicScheduleForm;