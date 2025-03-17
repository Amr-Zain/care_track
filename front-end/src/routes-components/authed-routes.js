import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
    const { user } = useSelector(state => state.authedUser);
    if (Object.keys(user).length) {
        return <Navigate to={`/${user.userType}`} replace />;
    }
    return <Outlet />;
};
export default AuthRoute