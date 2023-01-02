import Register from "./components/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import { useState } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );

  console.log(isAuth);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {isAuth && <Route path="/" element={<Home isAuth={isAuth} />} />}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
          <Route path="*" element={<Navigate to={"/login"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
