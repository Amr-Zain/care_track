import { IoChatbubbleEllipses } from "react-icons/io5";
import { dateFormatter } from "../../../api/helper";
import { DEFAULT_IMG_URL } from "../../../constants/default";
import { MEDICAL_HISTORY } from "../../../constants/routes";
import { useNavigate } from "react-router-dom";

export default function Patient({ patientImg, patientName, date, patientId }) {
    const navigate = useNavigate();
    const patientClickHandler = () => {
        navigate(`/${MEDICAL_HISTORY}/${patientId}`);
    };

    return (
        <div className="d-flex align-items-center gap-3 p-3 border rounded bg-white" > 
            <div className="">
                <img
                    src={patientImg || DEFAULT_IMG_URL}
                    alt={patientName}
                    className="rounded-circle"
                    style={{ width: "5rem", height: "5rem" }}
                />
            </div>
            <div 
                className="flex-grow-1"
                style={{ 
                    cursor: "pointer",
                    minWidth: 0 // Allows the flex item to shrink below content width
                }} 
                onClick={patientClickHandler}
            >
                {/* Added text-truncate to both elements and their container */}
                <h5 className="mb-0 text-truncate">{patientName}</h5>
                {date && (
                    <small className="text-muted text-truncate d-block">
                        {dateFormatter(new Date(date))}
                    </small>
                )}
            </div>
            <div className="flex-shrink-0 text-primary" style={{ fontSize: "2rem", cursor: "pointer" }}>
                <IoChatbubbleEllipses />
            </div>
        </div>
    );
}