import React, { useCallback, useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../lib/redux/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../lib/redux/slices/user/userThunks";
import {
  ACCESS_TOKEN_EXPIRY_MINUS_ONE_MINUTE,
  LOGOUT_PENDING_KEY,
  VITE_BACKEND_BASE_URL,
} from "../../config";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { isRouteProtected } from "../../utils/validateRoute";
interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const { isLoggedIn, loadingStatus, tokenExpiration } = useAppSelector(
    (state) => state.userData
  );
  const navigate = useNavigate();

  useEffect(() => {
    const auth = async () => {
      if (!isLoggedIn) {
        await dispatch(getUser({}));
      }
    };
    auth();
  }, [dispatch]);

  const logOut = useCallback(async () => {
    await dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn && loadingStatus === "rejected") {
      logOut();
      if (isRouteProtected(pathname)) navigate("/");
    }
  }, [isLoggedIn, loadingStatus, logOut, navigate]);

  useEffect(() => {
    const refreshToken = async () => {
      const axiosInstance = axios.create({
        baseURL: VITE_BACKEND_BASE_URL,
        withCredentials: true,
      });
      try {
        await axiosInstance.get(`/auth/refresh`);
      } catch (error) {
        //    console.log(error);

        logOut();
        if (isRouteProtected(pathname)) navigate("/");
      }
    };

    const handleTokenRefresh = () => {
      refreshToken();
    };

    if (!isLoggedIn) {
      return;
    }

    const interval = setInterval(() => {
      handleTokenRefresh();
    }, ACCESS_TOKEN_EXPIRY_MINUS_ONE_MINUTE);

    handleTokenRefresh();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoggedIn, logOut, navigate]);

  useEffect(() => {
    window.addEventListener("online", () => {
      if (JSON.parse(localStorage.getItem(LOGOUT_PENDING_KEY) || "false")) {
        logOut();
        if (isRouteProtected(pathname)) navigate("/");
      }
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let logoutTimer: any = null;
    if (isLoggedIn && tokenExpiration) {
      const remainingTime =
        new Date(tokenExpiration).getTime() - new Date().getTime();

      if (remainingTime <= 0) {
        logOut();
        if (isRouteProtected(pathname)) navigate("/");
      } else {
        logoutTimer = setTimeout(() => {
          logOut();
          if (isRouteProtected(pathname)) navigate("/");
        }, remainingTime);
      }
    } else {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }
    }

    // Clear the timeout on component unmount
    return () => {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
      }
    };
  }, [tokenExpiration, dispatch, isLoggedIn, logOut, navigate]);

  if (loadingStatus !== "rejected") {
    if (loadingStatus !== "fulfilled") {
      return <LoadingSpinner />;
    }
  }
  return <>{children}</>;
};

export default AuthProvider;
