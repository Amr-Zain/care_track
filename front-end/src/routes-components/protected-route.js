import { Navigate, Outlet } from "react-router-dom";
import { LOGIN, UNAUTHORIZED } from "../constants/routes";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const {user} = useSelector(state => state.authedUser);
    
    if (!Object.keys(user).length) {
        return <Navigate to={'/'+LOGIN} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.userType)) {
        return <Navigate to={'/'+UNAUTHORIZED} replace />;
    }

    return children || <Outlet />;
};
export default ProtectedRoute;