import { Clinic, ClinicSchedule } from "./../../schema";

export default interface ClinicDAO  {
    listDoctorClinics: (doctorId :string)=> Promise<Clinic[]>;
    getClinic: (clinicId :string)=> Promise<Clinic>;
    addClinic: (clinic :Clinic)=> Promise<void>;
    deleteClinic: (clinicId :string)=> Promise<void>;
    updateClinic: (clinic: Clinic)=>Promise<void>;
    getClinicSchedule: (clinicId :string)=> Promise<ClinicSchedule[]>;
    postClinicSchedule: (clinicSchedule: ClinicSchedule[],clinicId: string)=> Promise<void>;
    deleteDayFromSchedule: (clinicId :string, day :number)=> Promise<void>;
    updateScheduleDay: (clinicSchedule: ClinicSchedule)=> Promise<void>;
    postDayToSchedule: (clinicSchedule: ClinicSchedule)=> Promise<void>;
}