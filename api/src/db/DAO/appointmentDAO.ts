import { Appointment, PatientAppointment, DoctorNurseAppointment } from "./../../schema";

export default interface AppointmentDAO  {
    createAppointment: (appointment: Appointment)=>Promise<void>;
    getAppointmentById: (appointmentId: string)=>Promise<Appointment | null>;
    listPatientAppointment:( patientId: string )=>Promise<PatientAppointment[] |null>;
    listDoctorAppointment:( clinicId: string, date: Date )=> Promise<DoctorNurseAppointment[] | null>;
    listNurseAppoitment: ( nurseId: string, date:Date)=> Promise<DoctorNurseAppointment[] |null>;
    deleteAppointment: (appointmentId: string) =>Promise<void>;
    updateAppointmentDate: (appointmentId: string, newDate: Date) =>Promise<void>;
}