import { Link } from "react-router-dom";
import { BLOOD_BANK, BLOOD_DONATION, BLOOD_REQUEST, PATIENT } from "../../constants/routes";
import { Row, Col } from "react-bootstrap";

function BloodBankComponents() {
    return ( <Row className="my-auto g-4 justify-content-around align-items-center"style={{minHeight:'50vh'}}>
        <Col xs={5} md={4} className="text-center">
            <Link 
                to={`/${PATIENT}/${BLOOD_BANK}/${BLOOD_DONATION}`} 
                className="text-decoration-none text-dark"
            >
                <div className="p-4 border rounded-3 shadow-sm hover-effect bg-white" >
                    <img 
                        src="/images/blood_donation.png" 
                        alt="Blood donation" 
                        className="img-fluid mb-3"
                        style={{ width: '100px', height: '100px' }}
                    />
                    <h4 className="mb-0">Donation</h4>
                </div>
            </Link>
        </Col>


        <Col xs={5} md={4} className="text-center" >
            <Link 
                to={`/${PATIENT}/${BLOOD_BANK}/${BLOOD_REQUEST}`} 
                className="text-decoration-none text-dark"
                
            >
                <div className="p-4 border rounded-3 shadow-sm hover-effect bg-white">
                    <img 
                        src="/images/blood_request.png" 
                        alt="Blood request" 
                        className="img-fluid mb-3"
                        style={{ width: '100px', height: '100px' }}
                    />
                    <h4 className="mb-0">Request</h4>
                </div>
            </Link>
        </Col>
    </Row> );
}

export default BloodBankComponents;