import { RequestWithUserSession } from "../utill/types";
import Datastore from '../db/services';
import { StatusCodes } from "http-status-codes";
import { Response, Request } from "express";
import { Diagnosis, Medicine } from "../schema";
import { calcDiagnoisDate } from "../utill/dates"
import { randomUUID } from "crypto";

const datastore = new Datastore();



export const getPatientInfo = async ( req: Request, res: Response )=>{
    const patient = await datastore.patientInfo(req.params.patientId);
    res.status(StatusCodes.OK).json({ data: patient });
}
export const getUserDiagnosisSpecializations = async ( req: RequestWithUserSession, res: Response )=>{
    const patientId = req.params.patientId || req.user.id;
    if(!patientId)throw new Error('patheint id in null!!')
    const specializations = await datastore.getPtinetDiagnosisSpecializations(patientId);
    res.status(StatusCodes.OK).json({ data: specializations });
}
export const listDiagnosis = async (req: RequestWithUserSession, res: Response) => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const specializations: any = req.query.specializations;
    const date = calcDiagnoisDate(+req.query.date);
    const isOwnDoctorDiagnois: boolean= +req.query.isOwnDoctorDiagnois == 1;
    const patientId =req.user.userType ===1? req.user.id : req.params.patientId;

    const diagnosis = await datastore.listPatientDiagnosis(
        patientId,
        specializations,
        date,
        isOwnDoctorDiagnois,
        req.user.id);
    if(!diagnosis.length) return res.status(StatusCodes.OK).json({message: 'no diagnosis found, please reduce the filter to get results',data:[]})
    res.status(StatusCodes.OK).json({ data: diagnosis });
}


export const postDiagnois = async (req: RequestWithUserSession, res: Response) => {
    
    const id = randomUUID()
    const diagnosis: Diagnosis = {
        id,
        date: new Date(),
        doctorId: req.user.id,
        description: req.body.description,
        patientId: req.params.patientId,
        clinicId: req.body.clinicId,
        medicines: req.body.medicines.map(med => ({ ...med, id: randomUUID(), diagnosisId: id, dosage:med.dose }))
    }
    const date = diagnosis.date;
    date.setHours(0,0,0,0);
    const app = await datastore.appointmentExist(diagnosis.doctorId,diagnosis.patientId, date);
    if(!app) res.status(StatusCodes.FORBIDDEN).json({ message: 'not authrized' });
    if(!diagnosis.clinicId) diagnosis.clinicId = app.clinicId;
    await datastore.createDiagnosis(diagnosis);
    //await datastore.createDiagnosisMeds(diagnosis.medicines);
    res.status(StatusCodes.OK).json({ message: 'diagnosis created' });
}
export const getDiagnosis = async (req: RequestWithUserSession, res: Response) => {
    const diagnosis = await datastore.getDiagnosisById(req.params.diagnosisId);
    if (!diagnosis)
        res.status(StatusCodes.NOT_FOUND).json({ message: 'diagnosis not found' })
    if (diagnosis.patientId !== req.params.patientId)
        res.status(StatusCodes.FORBIDDEN).json({ message: 'not allowed to access' })
    res.status(StatusCodes.OK).json({ data: diagnosis });
}
export const listDiagnosisMedicnes = async(req: RequestWithUserSession, res: Response) => {
    const medicines = await datastore.getDiagnosisMedicnes(req.params.diagnosisId,req.params.patientId);
    if(!medicines.length)res.status(StatusCodes.NOT_FOUND).json({ message: 'diagnosis did not have medicines' })
    res.status(StatusCodes.OK).json({ data: medicines})
    
}
export const updateMedicine = async (req: RequestWithUserSession, res: Response) => {
    const medicine = await datastore.getMedicine(req.body.medicineId);
    if (!medicine) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'medicine not found' })
    }
    if (medicine.doctorId !== req.user.id) {
        res.status(StatusCodes.FORBIDDEN).json('not authrized to alter this filed')
    }
    const med= {
        id: req.body.medicineId,
        dosage: req.body.dose,
        name: req.body.name,
        duration: req.body.duration,
        description: req.body.description,
    }
    await datastore.updateMedicine(med as Medicine)
    res.status(StatusCodes.OK).json({ message: 'medicine successfully updated' });
}
export const deleteMedicine = async (req: RequestWithUserSession, res: Response) => {
    const medicine = await datastore.getMedicine(req.body.medicineId);
    if (!medicine) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'medicine not found' })
    }
    
    if (medicine.doctorId !== req.user.id) {
        res.status(StatusCodes.FORBIDDEN).json('not authrized to alter this filed')
    }
    await datastore.deleteMedicine(req.params.medicineId)
    res.status(StatusCodes.OK).json({ message: 'medicine delete' });
}
export const  getPatientMedicines = async (req: RequestWithUserSession, res:Response) =>{
    const patientId = req.user.userType ===1? req.user.id:req.params.patientId;
    const medicines = await datastore.getPatientMedicies(patientId);
    if(!medicines.length) res.status(StatusCodes.OK).json({ message:'patient does not take any medicines' });
    res.status(StatusCodes.OK).json({ data: medicines });
}