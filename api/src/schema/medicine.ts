import { object, string } from "yup";

export default interface Medicine {
    id: string;
    diagnosisId: string;
    doctorId?: string;
    name: string;
    dosage: number;
    duration: number;
    description: string
}
export const getCurentMedicinesSchema = object({
    params: object({
        patientId: string().required('patientId is required'),
    }),
});
