import { number, object, string } from "yup";

export default interface Appointment{
    id: string;
    patientId: string;
    clinicId: string | null;
    nurseId: string | null;
    bookedAt: Date;
    date: Date;
}

export interface PatientAppointment extends Appointment{
    doctorName: string;
    doctorImg: string;
    specialization: string;
    doctorRating: number;
    location: string;
    fees: number;
}

export interface DoctorNurseAppointment extends Appointment {
    bookedAt: Date; 
    date: Date; 
    patientName: string;
    patientImg: string;
    patientBirthday: Date;
    patientEmail: string;
}
export const AppointmentsSchema = object({
    body: object({
        clinicId: string().nullable(), 
        nurseId: string().nullable(), 
        date: number().required('date of the appointment is required'),
    }).test(
        function (value: { clinicId?: string; nurseId?: string }) {
            const { clinicId, nurseId } = value;
            if (!clinicId && !nurseId) {
            return this.createError({
                path: 'clinicId', 
                message: 'Either clinicId or nurseId is required',
            });
            }else if( !!clinicId && !!nurseId){
                console.log({clinicId:!!clinicId,nurseId:!!nurseId})
                return this.createError({
                    path: 'ids', 
                    message: 'Either clinicId or nurseId is required not both', 
                }); 
            }
            return true; 
        }
        ),
});

export const  listAppointmentsSchema = object({
    query: object({
        newDate: number().positive(),
    })
})

export const  updateAppointmentsSchema = object({
    params: object({
        appointmentId: string().required('appointmentId is required'),
    }),
    body: object({
        newDate: number().positive().required('newDate of the appointment is required'),
    })
})
export const  cancelAppointmentsSchema = object({
    params: object({
        appointmentId: string().required('appointmentId is required'),
    })
})

