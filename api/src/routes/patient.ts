import { Router } from 'express';
import requireUser from '../middleware/requireUser';
import validateRequest from '../middleware/validateRequest';

import { createDiagnosisSchema, 
        deleteDiagnosisMedicineSchema, 
        getDiagnosisSchema, 
        getPatientInfoShema, 
        listDiagnosisSchema, 
        updateDiagnosisMedicineSchema 
        } from '../schema/diagnosis';

import { listDiagnosis, 
        postDiagnois, 
        getDiagnosis, 
        updateMedicine, 
        deleteMedicine, 
        getPatientMedicines, 
        getPatientInfo,
        getUserDiagnosisSpecializations,
        listDiagnosisMedicnes} 
        from '../controllers/diagnosis';

import checkUserType from '../middleware/checkUserType';
import { checkDoctorAuthForDiagnosis } from '../middleware/authedDoctor';
import { getCurentMedicinesSchema } from '../schema/medicine';


const patientRouter = Router();
patientRouter.route('/:patientId').get(validateRequest(getPatientInfoShema),getPatientInfo)

patientRouter.route('/:patientId/diagnosis')
        .get([requireUser, 
                checkUserType([1, 2]), 
                validateRequest(listDiagnosisSchema)],
                checkDoctorAuthForDiagnosis, 
                listDiagnosis)
        .post([requireUser, 
                checkUserType([2]),
                checkDoctorAuthForDiagnosis, 
                validateRequest(createDiagnosisSchema)], 
                postDiagnois);

patientRouter.route('/:patientId/diagnosis/specializations')
                .get([requireUser, 
                        validateRequest(getPatientInfoShema)],
                        getUserDiagnosisSpecializations)

patientRouter.route('/:patientId/diagnosis/:diagnosisId')
.get([requireUser, checkUserType([1, 2]), checkDoctorAuthForDiagnosis, validateRequest(getDiagnosisSchema)], getDiagnosis)/* patient himsilf or a doctor with an appoin */

patientRouter.route('/:patientId/diagnosis/:diagnosisId/medicines')
                .get([requireUser, checkUserType([1, 2]), 
                checkDoctorAuthForDiagnosis, 
                validateRequest(getDiagnosisSchema)], 
                listDiagnosisMedicnes)
                .patch([requireUser, checkUserType([2]), checkDoctorAuthForDiagnosis,
                        validateRequest(updateDiagnosisMedicineSchema)], 
                        updateMedicine)
                .delete([requireUser, checkUserType([2]), checkDoctorAuthForDiagnosis,
                        validateRequest(deleteDiagnosisMedicineSchema)], 
                        deleteMedicine);


patientRouter.route('/:patientId/medicines')
                .get(requireUser, 
                        checkUserType([1,2]),
                        checkDoctorAuthForDiagnosis, 
                        validateRequest(getCurentMedicinesSchema),
                        getPatientMedicines);




export default patientRouter;