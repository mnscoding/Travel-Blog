/*
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = () => {
    //remove user from storage
    localStorage.removeItem("user");

    //dispatch logout action
    dispatch({ type: "LOGOUT" });
  };
  return { logout };
};*/

import { useAuthContext } from "./useAuthContext";
import { useProfilesContext } from "./useProfileContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: profileDispatch } = useProfilesContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    profileDispatch({ type: "SET_PROFILE", payload: null });
  };

  return { logout };
};
