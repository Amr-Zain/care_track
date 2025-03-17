import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { LOGIN, UNAUTHORIZED } from "../constants/routes";

const NotFoundOrUnauthorized = () => {
    const {user} = useSelector(state => state.authedUser);
    const location = useLocation();

    if (location.pathname === '/'+UNAUTHORIZED && !Object.keys(user).length) {
        return <Navigate to={'/'+LOGIN} replace />;

    }

    if (location.pathname === '/'+UNAUTHORIZED) {
        return <div>
                <h1>Unauthorized</h1>
                <p>You do not have permission to access this page.</p>
            </div>;
    } else {
        return  <h2>
                    Route does not exit
                </h2>;;
                }
};
export default NotFoundOrUnauthorized;