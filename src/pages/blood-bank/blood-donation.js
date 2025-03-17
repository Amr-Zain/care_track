import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import BloodBankForm from "../../components/blood-bank/form";


function BloodDonation() {
    
    useEffect(()=>{
        document.title = 'Blood Donation';
    },[]);
    return (
        <Row className="py-5 justify-content-center" >
            <Col xs={12} md={8} lg={6}>
                <BloodBankForm  isRequest={false}/>
            </Col>
        </Row>
);
}

export default BloodDonation;