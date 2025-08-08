import { useContext } from "react";
import { ProfilesContext } from "../context/ProfileContext";

export const useProfilesContext = () => {
  const context = useContext(ProfilesContext);

  if (!context) {
    throw Error(
      "useProfilesContext must be used inside a ProfilesContextProvider"
    );
  }

  return context;
};
