import { DoctorData, DoctorFullData, NurseFullData } from "../../schema/doctor-nurse";
export default interface DoctorNurseDAO  {
    createDoctorNurseData: (data: DoctorData )=>Promise<void>;
    updateDoctorNurseData: ( data: DoctorData )=>Promise<void>;
    getDoctor: (id: string) => Promise<DoctorFullData>
    getNurse: (id: string) => Promise<NurseFullData>;
}