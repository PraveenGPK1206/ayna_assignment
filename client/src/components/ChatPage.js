import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { io } from "socket.io-client";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  height:80vh;
`;


const TopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width:80%;
`;


const MessagesContainer = styled.div`
  width:80%;
  height:60vh;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 10px;
  background-color:rgb(11,26,51);
`;

const Message = styled.div`
  margin-bottom: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  width:80%;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  outline: none;
`;

const Button = styled.button`
  padding: 10px;
  margin-left: 10px;
  border: 1px solid #ddd; 
  border-radius: 5px;
`;

  const Logout = styled.button`
  width: auto; 
  padding: 10px 20px; 
  font-size: 16px; 
  border: 1px solid #ddd; 
  border-radius: 5px; 
  margin-left:auto;
`;


const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  color: #fff;
  background-color: ${(props) => (props.isUser ? "#4caf50" : "#2196f3")};
  text-align: ${(props) => (props.isUser ? "right" : "left")};
`;

const ChatScreen=styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
  width:100%;
`;

const Greeting=styled.p`
font-size:1em;
font-weight:300;
`;

const ChatBox = ({ user, setUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const loadMessages = () => {
      try {
        const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
        setMessages(savedMessages);
      } catch (error) {
        console.error("Error loading messages from localStorage:", error);
      }
    };

    loadMessages();

    const socketInstance = io("http://localhost:1337");
    setSocket(socketInstance);

    socketInstance.on("message", (message) => {
      const newMessage = message;
      setMessages((prev) => {
        const updatedMessages = [...prev, newMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); 
        return updatedMessages;
      });
    });

    
    return () => {
      socketInstance.disconnect();
    };
  }, []); 

  
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { sender: "You", text: input };
      setMessages((prev) => {
        const updatedMessages = [...prev, newMessage];
        localStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); 
        return updatedMessages;
      });
      const clientMessage={sender: user.username, text: input}
      socket.emit("message", clientMessage); 
      setInput(""); 
      console.log(user.username);
  };
}

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    localStorage.removeItem("chatMessages"); 
    setUser(null); 
  };


  return (
    <Container>
    <ChatScreen>
      <TopContainer>
        <Greeting>Welcome, {user.username} </Greeting>
        <Logout onClick={handleLogout}>Logout</Logout>
      </TopContainer>
      
      <MessagesContainer>
        {messages.map((msg, idx) => (
          <MessageWrapper key={idx} isUser={msg.sender === "You"}>
            <MessageBubble isUser={msg.sender === "You"}>
              <strong>{msg.sender}:</strong> {msg.text}
            </MessageBubble>
          </MessageWrapper>
        ))}
      </MessagesContainer>

      <InputContainer>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </InputContainer>
      </ChatScreen>
    
    </Container>
  );
};

export default ChatBox;
