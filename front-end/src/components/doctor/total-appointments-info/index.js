import { memo } from "react";
import { FaUserMd } from "react-icons/fa";
import { MdSchedule } from "react-icons/md";
import { Card } from "react-bootstrap";

function Info({ isTotal, count }) {
   
    return (
        <Card className="h-100 shadow-sm p-4 bg-white">
            <div className="d-flex align-items-center gap-4">
                <div className="text-primary" style={{ fontSize: '5rem' }}>
                    {isTotal ? <FaUserMd /> : <MdSchedule />}
                </div>
                <div className="flex-fill" style={{maxWidth:'fit-content'}}>
                    <h5 className="text-muted mb-2">
                        {isTotal ? 'Total Patients' : 'Today Appointments'}
                    </h5>
                    <div className="display-5 fw-bold text-center">
                        { count }
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default memo(Info);