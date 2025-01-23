import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  background-color:rgb(11,26,51);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color:  rgb(101, 148, 236);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const SwitchButton = styled.button`
  margin-top: 15px;
  font-size: 14px;
  color: rgb(34, 100, 224);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;

`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 50px;
  text-align: center;
   color: rgb(216, 221, 230)
`;

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin
      ? "http://localhost:1337/api/auth/local"
      : "http://localhost:1337/api/auth/local/register";

    try {
      const payload = isLogin
        ? { identifier: email, password }
        : { username, email, password };

      const response = await axios.post(endpoint, payload);
      setUser(response.data.user);
      localStorage.setItem("token", response.data.jwt); 
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert(isLogin ? "Login successful!" : "Registration successful!");
    } catch (error) {
      console.error("Authentication error:", error.response?.data || error.message);
      alert("Authentication failed. Please check your credentials.");
    }
  };

  return (
    <AuthContainer>
      <Form onSubmit={handleSubmit}>
        <Title>{isLogin ? "Login" : "Register"}</Title>
        {!isLogin && (
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={!isLogin}
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">{isLogin ? "Login" : "Register"}</Button>
      </Form>
      <SwitchButton onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? "Register" : "Login"}
      </SwitchButton>
    </AuthContainer>
  );
};

export default Auth;