import { object, string, number } from "yup";

export default interface Patient {
    id : string;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    city: string |number;
    age: number;
    img: string;
}

export const getPatienAppointmentsSchema = object({
    
})
export const createAppointmentSchema = object({
    body: object({
        doctorId: string().required('doctorId is required'),
        appointmentDate: number().required('appointentDate is required'),
    })
})
export const getDiseasesSchema = object({//it is not it's place I still thinking about the strucure of it
    params: object({
        patientId : string().required('patientId is required')
    })
})

/*
-patient 
search style 
blood bank style
medical history => diseases
footer

-doctor nurse receptionsit  
dashboard (date cards of patient add patient delete patient)
-chat 


*/