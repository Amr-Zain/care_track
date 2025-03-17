import { useEffect } from "react";
import BloodBankComponents from "../../components/blood-bank/blood-bank-components";

function BloodBank() {
    useEffect(() => {
        document.title = 'Blood Bank';
    });

    return (
            <BloodBankComponents />
    );
}

export default BloodBank;