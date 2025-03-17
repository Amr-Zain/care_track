import { useEffect, useState } from "react";
import { Accordion, Card, Container } from "react-bootstrap";
import ClinicForm from "../../components/doctor/settings/clinicForm";
import ScheduleForm from "../../components/doctor/settings/scheduleForm";
import ImageForm from "../../components/doctor/settings/ProfileImageForm";
import { DOCTOR } from "../../constants/routes";
import { useSelector } from "react-redux";

function Settings() {
    const [activeKey, setActiveKey] = useState(null);
    const { userType } = useSelector(store=>store.authedUser.user)
    useEffect(() => {
        document.title = 'Settings';
    }, []);

    const handleAccordion = (key) => {
        setActiveKey(activeKey === key ? null : key);
    };

    return (
        <Container className="py-4">
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <Card.Title as="h3" className="mb-0">Settings</Card.Title>
                </Card.Header>
            </Card>

            <Accordion activeKey={activeKey} onSelect={handleAccordion}>
                {userType ===DOCTOR&&<><Accordion.Item eventKey="clinic" className="bg-white">
                    <Accordion.Header className="bg-white">
                        <span className="d-flex align-items-center gap-2">
                            Add Clinic
                        </span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <ClinicForm />
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="schedule"  className="bg-white" >
                    <Accordion.Header>
                        <span className="d-flex align-items-center gap-2">
                            Create Clinic Schedule
                        </span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <ScheduleForm />
                    </Accordion.Body>
                </Accordion.Item>
                </>}

                <Accordion.Item eventKey="image" className="mb-3 bg-white">
                    <Accordion.Header>
                        <span className="d-flex align-items-center gap-2">
                            Upload Profile Images
                        </span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <ImageForm />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
}

export default Settings;