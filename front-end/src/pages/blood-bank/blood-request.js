import { useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import BloodBankForm from "../../components/blood-bank/form";

function BloodDonation() {
   

    useEffect(() => {
        document.title = 'Blood Request';
    }, []);
    return (
            <Row className="py-5 justify-content-center" >
                <Col xs={12} md={8} lg={6}>
                    <BloodBankForm isRequest />
                </Col>
            </Row>
    );
}

export default BloodDonation;