import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "../config";

export const isRoutePublic = (pathname: string) => {
  return PUBLIC_ROUTES.some((publicRoute) => {
    const regex = new RegExp(`^${publicRoute.replace(/:\w+/g, "\\w+")}$`);
    return regex.test(pathname);
  });
};

export const isRouteProtected = (pathname: string) => {
  return PROTECTED_ROUTES.some((protectedRoute) => {
    const regex = new RegExp(`^${protectedRoute.replace(/:\w+/g, "\\w+")}$`);
    return regex.test(pathname);
  });
};
