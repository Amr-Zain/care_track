import { useState } from "react";
import DiagnosisList from "./diagnosisList";
import Medicines from "./medicines";
import { useSelector } from "react-redux";
import PatientInfo from "./patientInfo";
import { MdAdd } from 'react-icons/md';
import AddDiagnosis from "./add-diagnosis";
import { useParams, useSearchParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import '../../style/medical-history.css'
import { DOCTOR } from "../../constants/routes";

const tabs = [
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'medicines', label: 'Medicines' },
    { id: 'add-diagnosis', label: 'Add Diagnosis' },
];

export default function MedicalHistoryComponents() {
    const { id:userId,userType } = useSelector(store => store.authedUser.user);
    const { patientId } = useParams();
    const [searchParams,setSearchParams] = useSearchParams()
    const initialKey = tabs.find(t => t.id === searchParams.get('tab'))?.id || 'diagnosis';
    const [key, setKey] = useState(initialKey);
    const id = patientId ? patientId : userId;

    const handleSelect = (k) => {
        setKey(k);
        setSearchParams({ tab: k})
    };

    return (
        <>
            <PatientInfo patientId={id} />
            <Tabs
                id="medical-history-tabs"
                activeKey={key}
                onSelect={handleSelect}
                className="my-5 bg-white shadow-sm m-2 border rounded"
            >
                <Tab eventKey="diagnosis" title="Diagnosis">
                    <DiagnosisList patientId={id} />
                </Tab>
                <Tab eventKey="medicines" title="Medicines">
                    <Medicines patientId={id} />
                </Tab>
                {userType===DOCTOR&&<Tab eventKey="add-diagnosis" title={<span><MdAdd aria-hidden="true" /> Add Diagnosis</span>}>
                    <AddDiagnosis patientId={id} onSuccess={() => setKey('diagnosis')} />
                </Tab>}
                
            </Tabs>
        </>
    );
}