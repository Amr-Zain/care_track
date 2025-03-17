import { useEffect } from "react";
import MedicahComponents from '../../components/medical-history'
export default function MedicalHistory(){
    useEffect(()=>{
        document.title = 'Medical History';
    });
    return( <div className="medical-history">
                    <MedicahComponents />
            </div>)
}