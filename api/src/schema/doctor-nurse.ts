import { number, object, string } from "yup";
import { User } from ".";
import Clinic from "./clinic";

export interface DoctorData {
    userId: string
    fees: number;
    description: string;
    appointmentTime: number;
    specialization: string;
}
export interface NurseData {
    userId: string
    fees: number;
    description: string;
    location: string;
}
export interface DoctorNurseAttributes {
    userId: string;
    specialization: string | null;
    fees: number; // DECIMAL(6, 2) maps to number
    description: string;
    appointmentTime: number | null;
    location: string | null;
  }
  export interface DoctorSchedule {
    day: [0, 1, 2, 3, 4, 5, 6];
    DoctorId: string;
    from: TimeRanges;
    to: TimeRanges;
}

export interface Rating {
    ratedId: string,
    patientId: string,
    rating: number,
    comment: string
}
export interface DoctorFullData extends DoctorData, User { clinics: Clinic[] }
export interface NurseFullData extends NurseData, User { }
const body = object({
    description: string().required('description is required'),
    specialization: string().required('description is required'),
    appointmentTime: number().required('appointmentTime is required'),
    fees: number().required('fees field is required')
});


export const postDoctorDataSchema = object({ 
    body
});
export const postNurseDataSchema = object({
    body: object({
        description: string().required('description is required'),
        location: string().required('location is required'),
        fees: number().positive()
    }),
});
export const getDoctorNurseSchema = object({
    params: object({
        id: string().required('id is required'),
    })
});
export const updateDoctorDataSchema = object({
    body
})

export const getDoctorAppointmentsSchema = object({
    body: object({
        date: number().required('date of the Appointments is required'),
        clinicId: string().required('clinicId is required')
    }),
    params: object({
        id: string()
    })
})
export const createAppointentSchema = object({
    body: object({
        patientEmail: string().required('patientEmail is required'),
        appointmentDate: number().required('appointmentDate is required'),
    })
})