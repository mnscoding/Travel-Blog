import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { PostsContextProvider } from "./context/PostContext";
import { AuthContextProvider } from "./context/AuthContext";
import { ProfilesContextProvider } from "./context/ProfileContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <PostsContextProvider>
        <ProfilesContextProvider>
          <App />
        </ProfilesContextProvider>
      </PostsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
