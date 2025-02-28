import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/landingpage";
import UserLogin from "./pages/login/Userlogin";
import UserSignup from "./pages/signup/UserSignup";
import CaptainSignup from "./pages/signup/DriverSignup";
import CaptainLogin from "./pages/login/CaptainLogin";
import DriverDetailsForm from "./components/Driverdetailsform";
import UserContext from "./context/UserContext"; // Ensure correct path
import CaptainContext from "./context/CaptainContext";
import UserProtectWrapper from "./pages/UserprotectedWrapper";
import CaptainProtectWrapper from "./pages/Captainproctedwrapper";
import Home from "./pages/Home/userhome";
import Captainhome from "./pages/Home/captainhome";
import UserLogout from "./pages/Logout/Userlogout";
import CaptainLogout from "./pages/Logout/CaptainLogout";
import Riding from "./pages/Ride";
import CaptainRiding from "./pages/CaptainRiding";
import SocketProvider from "./context/SocketContext";
const App = () => {
  return (
    <CaptainContext>
<UserContext>  {/* Wrap the whole app in UserContext */}
<SocketProvider>


      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path='/user/login' element={<UserLogin />} />
           <Route path='/riding' element={<Riding />} />
          <Route path='/user/signup' element={<UserSignup />} />
          <Route path='/driver/signup' element={<CaptainSignup />} />
          <Route path='/driver/login' element={<CaptainLogin/>} />
          <Route path='/driverdetails' element={<DriverDetailsForm/>} />
          <Route path='/driver/riding' element={<CaptainRiding/>}/>
          <Route
              path="/user/home"
              element={
                // <UserProtectWrapper>
                 <Home/>
                // </UserProtectWrapper>
              }
            />

            <Route
              path="/driver/home"
              element={
                <CaptainProtectWrapper>  {/* Use correct wrapper */}
                <Captainhome/>
                </CaptainProtectWrapper>
              }
            />
            <Route
              path="/user/logout"
              element={
                <UserProtectWrapper>
                  <UserLogout/>
                </UserProtectWrapper>
              }
            />
             <Route path='/driver/logout' element={<CaptainLogout/>} />

        </Routes>
      </Router>
      </SocketProvider>
    </UserContext>
    </CaptainContext>
    
  );
};

export default App;
