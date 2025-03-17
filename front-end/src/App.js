import {   Suspense, useEffect  } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "./features/authedUser";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.authedUser); 
  
useEffect(()=>{
  const token = localStorage.getItem('accessToken'); 
  const refreshToken = localStorage.getItem('refreshToken'); 
  if (token && !Object.keys(user).length) { 
      dispatch(getUserData({token, refreshToken}))
  } 
},[dispatch, user])

  return(
        <Suspense fallback={<h3>Loading</h3>}>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
          <RouterProvider router={router} />
        </Suspense>  );
}

export default App;
