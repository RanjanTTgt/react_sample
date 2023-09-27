import { Routes, Route, Navigate } from 'react-router-dom';
import "./assets/css/bootstrap.min.css";
import "./assets/css/style.css";
import { BaseLayout, PrivateLayout } from './components/Layout';
import { Dashboard } from './Pages/Dashboard';
import { NotFound } from './Pages/NotFound';
import { LogIn, ForgotPassword, ResetPassword, VerifyOtp } from "./Pages/Auth";
import {
  ChangePassword,
} from "./Pages/User";

const App = () => (
  <Routes>
    <Route element={<BaseLayout />}>
      <Route path="/login" element={<LogIn />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/verifyOtp" element={<VerifyOtp />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
    </Route>
    <Route element={<PrivateLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* User Route End*/}
        <Route path="/changePassword" element={<ChangePassword />} />
      {/* User Route End*/}

      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
