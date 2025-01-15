import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/landingpage/landingpage';
import { AuthProvider } from './context/authcontext';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import DriverDetailsForm from './components/DriverDetailForms';
import DriverHome from './pages/home/driverhome';
import UserHome from './pages/home/userhome';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login/:role" element={<Login />} />
                    <Route path="/signup/:role" element={<Signup />} />
                    <Route path="/driver/details" element={<DriverDetailsForm />} />
                    <Route path="/home/user" element={<UserHome />} />
                    <Route path="/home/driver" element={<DriverHome />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
