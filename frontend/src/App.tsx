import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import "./App.css";
import Toast from "./components/Toast/Toast";
import MainHeader from "./components/Navigation/MainHeader/MainHeader";
import NotFound from "./pages/NotFound/NotFound";
import HomePage from "./pages/HomePage/HomePage";
import Signin from "./pages/SignIn/Signin";
import Signup from "./pages/SignUp/SignUp";
import AccountActivation from "./pages/AccountActivation/AccountActivation";
import { useAppSelector } from "./lib/redux/hooks";
import SuccessOrError from "./pages/SuccessOrError/SuccessOrError";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

function App() {
  const { isLoggedIn } = useAppSelector((state) => state.userData);

  // When you add a new route here, Please add thet routes into config
  const publicRoutes = (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/activate-account/:token" element={<AccountActivation />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/success-or-error" element={<SuccessOrError />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  const protectedRoutes = (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/success-or-error" element={<SuccessOrError />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
  const routes = isLoggedIn ? protectedRoutes : publicRoutes;
  return (
    <>
      <MainHeader />
      <Box>{routes}</Box>
      <Toast />
    </>
  );
}

export default App;
