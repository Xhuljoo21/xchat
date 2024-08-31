import { useEffect, useState } from "react";
import ChatInterface from "./components/ChatInterface.tsx";
import { io } from "socket.io-client";

type Messages = {
  type: "send" | "recieve";
  message: string;
};

function App() {
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("response", (message) => {
      console.log(message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "recieve",
          message,
        },
      ]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = () => {
    console.log(inputMessage);
    setMessages([
      ...messages,
      {
        type: "send",
        message: inputMessage,
      },
    ]);
    socket.emit("message", inputMessage);
    setInputMessage("");
  };

  return (
    <div className="h-screen bg-gray-900">
      <div className="container mx-auto h-full flex flex-col ">
        <p className="text-white text-center text-2xl">X CHAT</p>
        <div className="flex-grow my-auto flex-row items-end flex bg-gray-900">
          {/* //<History /> */}
          <div className="w-full p-3">
            {messages.map((message, index) => (
              <ChatInterface
                message={message.message}
                key={index}
                type={message.type}
              />
            ))}
          </div>
        </div>
        <div className="h-[100px] bg-gray-700 flex justify-center items-center">
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            name=""
            id=""
            placeholder="Type Something"
            className="w-full m-2 p-2 bg-transparent border-white text-white border-2 rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-violet-600 py-2 rounded text-white mx-2 px-3"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
