import React from "react";

type Childs = {
  message: string;
  type: string;
};

function ChatInterface({ message, type }: Childs) {
  return (
    <div
      className={`flex ${
        type === "send" ? "justify-start" : "justify-end"
      } mt-2 mb-2`}
    >
      {type === "send" ? (
        <div className="bg-violet-600 rounded p-2 text-white rounded-tr-lg rounded-b-lg">
          {message}
        </div>
      ) : (
        <div className="bg-green-100 rounded p-2 rounded-b-lg rounded-tl-lg">
          {message}
        </div>
      )}
    </div>
  );
}

export default ChatInterface;
