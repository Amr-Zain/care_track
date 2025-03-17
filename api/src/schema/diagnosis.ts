import { object, string, array, number, bool, mixed, lazy } from "yup";
import  Medicine  from'./medicine'
export default interface Diagnosis {
    id: string;
    patientId: string;
    doctorId: string;
    clinicId: string;
    description: string;
    date: Date;
    medicines: Medicine[] | null;
}
export interface DiagnosisWithDoctorInfo extends Diagnosis {
    doctorName: string;
    doctorImage: string;
    specialization: string;
}

export const getPatientInfoShema = object({
    params: object({
        patientId: string().required('patientId is required'),
    })});
export const listDiagnosisSchema = object({
    params: object({
        patientId: string().required('patientId is required'),
    }),
    query: object({
        specializations : lazy((value) => {
            if (typeof value === 'string') {
                return string();
            } else if (Array.isArray(value)) {
                return array().of(string());
            }
            return mixed();
          }), 
        date: number().required('date field is required with value of (0,1,2,3)').oneOf([0,1,2,3]),
        isOwnDoctorDiagnois: bool().default(false),
    })
});
export const getDiagnosisSchema = object({
    params: object({
        diagnosisId: string().required('diagnosisId is required'),
        patientId: string().required('diagnosisId is required'),

    })
});
export const getDiagnosisSpecializationsSchema = object({
    body: object({
        patientId: string().required('patientId is required'),
    }),
});
export const createDiagnosisSchema = object({
    params: object({
        patientId: string().required('patientId is required'),
    }),
    body: object({
        description: string().required('description is required'),
        clinicId: string().nullable(),
        medicines: array()
                .of(object({
                    name: string().required('medicine name is required'),
                    dose: number().positive().required('medicine dosage aday is required'),
                    duration: number().positive().required('medicine dutation in days is required'),
                    description: string()
                })),
    })
});
export const updateDiagnosisMedicineSchema = object({
    params: object({
        diagnosisId: string().required('diagnosisId is required'),
        patientId: string().required('patientId is required'),
    }),
    body: object({
        medicineId: string().required('medicineId is required'),
        name: string().required('medicine name is required'),
        dose: number().required('medicine dosage aday is required'),
        dutation: number().required('medicine dutation in days is required'),
        description: string().required('description for the midicine is required')
    })
});
export const deleteDiagnosisMedicineSchema = object({
    params: object({
        diagnosisId: string().required('diagnosisId is required'),
        patientId: string().required('patientId is required'),
    }),
    body: object({
        medicineId: string().required('medicine id is required'),
    })
});
