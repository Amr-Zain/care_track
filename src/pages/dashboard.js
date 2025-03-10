import { Navigate } from "react-router-dom";
import { LOGIN } from "../constants/routes";

function Dashboard() {
    return(
        <Navigate to={`/${LOGIN}`} />
    ); ;
}

export default Dashboard;