import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import ChatPage from "./components/ChatPage.js";
import "./App.css"
const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser)); 
    }
  }, []);
  return (
  <div>
    <h1>Real-Time Chat Application</h1>
    {user ? <ChatPage user={user} setUser={setUser}/> : <Auth setUser={setUser} />}
  </div>
  );
};

export default App;
