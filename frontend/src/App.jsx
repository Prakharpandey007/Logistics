import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/landingpage";
import UserLogin from "./pages/login/Userlogin";
import UserSignup from "./pages/signup/UserSignup";
import CaptainSignup from "./pages/signup/DriverSignup";
import CaptainLogin from "./pages/login/CaptainLogin";
import DriverDetailsForm from "./components/Driverdetailsform";
import UserContext from "./context/UserContext"; // Ensure correct path
import CaptainContext from "./context/CaptainContext";

const App = () => {
  return (
    <CaptainContext>
<UserContext>  {/* Wrap the whole app in UserContext */}
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path='/user/login' element={<UserLogin />} />
          <Route path='/user/signup' element={<UserSignup />} />
          <Route path='/driver/signup' element={<CaptainSignup />} />
          <Route path='/driver/login' element={<CaptainLogin/>} />
          <Route path='/driverdetails' element={<DriverDetailsForm/>} />


        </Routes>
      </Router>
    </UserContext>
    </CaptainContext>
    
  );
};

export default App;
