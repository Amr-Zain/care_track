import { Controller, useForm } from "react-hook-form";
import { createClinic } from "../../../api/data";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCitiesAndSpecializations } from "../../../features/cities-specializations";
import Input from "../../signup/input";
import Select from "react-select";

function ClinicForm() {
    const {
            register,
            handleSubmit,
            control,
            reset,
            formState: { errors },
        } = useForm({
            defaultValues: {
                clinicName: "", // Initialize default values for all fields
                clinicPhone: "",
                appointmentPeriod: "",
                city: null, // For react-select, initialize as null
                clinicLocation: "",
            }
        });
    const {cities} = useSelector(state=>state.citiesAndSpecializations);
    const [clinicStatus,setClinicStatus] = useState({isLoading:false, error:''})
    const addClinic = async(data)=>{
        try {
            setClinicStatus({ isLoading: true, error: null });
            await createClinic(data);
            setClinicStatus({ isLoading: false, error: null });
            reset();
            alert("Clinic created successfully!"); 
          } catch (error) {
            console.error("Clinic creation failed: ", error);
            setClinicStatus({ isLoading: false, error: error.message || "An error occurred." }); 
          }
        }
    const dispatch = useDispatch();
    useEffect(()=>{
        if(!cities.length)dispatch(getCitiesAndSpecializations());
    })
    return ( 
        <form onSubmit={handleSubmit(addClinic)}>
            <Input
                type="text"
                placeholder="Cinic Name"
                register={register("clinicName", { 
                required: "Clinic Name Is Required",
                setValueAs: value => value.replace(/\s+/g, ' ').trim() 
                })}
                error={errors.clinicName}
            />
            <Input
                type="tel"
                placeholder="Phone Number"
                register={register("clinicPhone", { 
                    required: "Clinic Phone is required",
                    pattern: {
                    value: /^01[0-9]{9}$/,
                    message: "Invalid phone number"
                    }
                })}
                error={errors.clinicPhone}
            />
            
            <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }} 
                render={({ field, fieldState: { error } }) => ( 
                    <div>
                        <Select
                            {...field}  
                            placeholder="Choose City"
                            options={cities}
                            isClearable 
                        />
                        {error && <span className="error">{error.message}</span>} 
                    </div>
                )}
            />
            <div>
                <textarea 
                    placeholder="Clinic Location"
                    rows="3" cols="40"
                    {...register('clinicLocation', { 
                        required: "Clinic Location is required",
                    })}
                /> 
                    {errors.clinicLocation && <span className="error-message">{errors.clinicLocation.message}</span>}
            </div>
            <button disabled={clinicStatus.isLoading} type="submit" className="login-bottom">
                { clinicStatus.isLoading?'Loaing...': 'Submit'}
            </button>
            {clinicStatus.error && <p className="error">{clinicStatus.error}</p>}
        </form> );
}

export default ClinicForm;