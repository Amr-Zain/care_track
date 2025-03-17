import { DoctorData, DoctorFullData, DoctorSchedule, NurseFullData } from "../../schema/doctor-nurse";
export default interface DoctorNurseDAO  {
    createDoctorNurseData: (data: DoctorData )=>Promise<void>;
    updateDoctorNurseData: ( data: DoctorData )=>Promise<void>;
    getDoctor: (id: string) => Promise<DoctorFullData>
    getNurse: (id: string) => Promise<NurseFullData>
    /*getDoctorSchedule: (doctorId: string) => Promise<DoctorSchedule[]> 
    addDayToDoctorSchedule: ( day: DoctorSchedule) => Promise<void>;
    updateSchedule: (day: DoctorSchedule ) => Promise<void>;
    deleteDayDoctorSchedule:( doctorId: string, dayId: [0,1,2,3,4,5,6])=>Promise<void>;
    deleteDoctorSchedule: ( doctorId: string ) => Promise<void>; */
}