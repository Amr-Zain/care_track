import { Receptionist } from "../../schema";

export default interface receptionistDAO  {
    getReceptionist: (receptionistId: string, clinicId: string)=>Promise<Receptionist>;
    listReceptionists: (clinicId: string, doctorId :string)=>Promise<Receptionist[]>;
    createReceptionist: (clinicId: string, receptionistId: string, doctorId: string)=>Promise<void>;
    deleteReceptionist: (clinicId: string, receptionistId: string)=>Promise<void>;
    isReceptionistOfDoctor:( doctorId: string, receptionistId: string )=> Promise<Receptionist| null>;

}