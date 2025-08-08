import { createContext, useReducer } from "react";

export const ProfilesContext = createContext();

const profilesReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROFILES":
      return {
        profiles: action.payload,
      };
    case "UPDATE_PROFILE":
      return {
        profiles: state.profiles.map((p) =>
          p._id === action.payload._id ? action.payload : p
        ),
      };
    default:
      return state;
  }
};

export const ProfilesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profilesReducer, {
    profiles: [], // or null if only a single profile per user
  });

  return (
    <ProfilesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ProfilesContext.Provider>
  );
};
