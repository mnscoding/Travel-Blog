import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

//pages &components
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Post from "./pages/Post";
import PublicPost from "./pages/NewHome";
import Profile from "./pages/Profile";
import Destination from "./pages/Destination";
import Dashboard from "./pages/Dashboard";

function App() {
  const { user } = useAuthContext();

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  user.role === "Admin" ? (
                    <Dashboard />
                  ) : (
                    <Post />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/home"
              element={user ? <Home /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/publicpost"
              element={user ? <PublicPost /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/destinations"
              element={user ? <Destination /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/profile"
              element={user ? <Profile /> : <Login />}
            ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
