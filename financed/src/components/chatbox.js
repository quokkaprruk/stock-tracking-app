"use client";
import React, { useState } from "react";
import Image from "next/image";
const Chatbox = ({ stock }) => {
  const [messages, setMessages] = useState([]); //all history message between user and bot
  const [inputValue, setInputValue] = useState(""); //user sending msg
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSend = () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, sender: "user" };
      setMessages([...messages, userMessage]);
      setInputValue("");

      fetch(`http://localhost:5000/ask/${stock}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: inputValue }),
      })
        .then((response) => response.json())
        .then((data) => {
          const botMessage = { text: data.answer, sender: "bot" };
          setMessages([...messages, userMessage, botMessage]); //shallow copy old msg + user msg + bot msg
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  return (
    <div>
      {isChatOpen && (
        <div className="fixed bottom-20 right-5 mb-10 mr-5 flex flex-col bg-[#f9f9f9] w-[450px] h-[470px] shadow-[0px_0px_15px_rgba(0,0,0,0.1)] rounded-t-2xl">
          <div className="sticky top-0 flex items-center justify-center bg-gradient-to-r from-[#89ef72] to-[#6cf289] p-4 rounded-t-2xl shadow-[0px_10px_15px_rgba(0,0,0,0.1)]">
            <div className="mr-4">
              <Image
                src="/chat.png"
                alt="Background Image"
                width={50}
                height={50}
                objectFit="cover"
                quality={75}
                priority // This ensures the image loads quickly
                className=""
              />
            </div>
            <div>
              <h4 className="text-white text-lg">Chat with Financed</h4>
              <p className="text-white text-sm">
                Hi, I'm Fina. How can I help you?
              </p>
            </div>
          </div>
          <div className="flex flex-col overflow-y-auto mt-auto px-5 pb-10">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mt-2 p-2 max-w-[80%] break-words ${
                  message.sender === "user"
                    ? "bg-teal-500 text-white self-end rounded-t-2xl rounded-bl-2xl"
                    : "bg-[#E0E0E0] text-gray-800 self-start rounded-t-2xl rounded-br-2xl"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 flex items-center justify-between p-5 bg-gradient-to-r from-[#89ef72] to-[#6cf289] shadow-[0px_-10px_15px_rgba(0,0,0,0.1)] rounded-b-xl">
            <input
              type="text"
              placeholder="Write a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow border-none p-3 rounded-full text-left"
            />
            <button
              className="bg-transparent border-none outline-none cursor-pointer"
              onClick={handleSend}
            >
              <svg
                className="w-6 h-6 text-white ml-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.5 21L23 12 2.5 3V10L17 12 2.5 14V21Z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div
        className="fixed bottom-10 right-10 z-50 cursor-pointer bg-green-400 p-3 rounded-full transform transition-transform duration-200 hover:scale-125"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <svg
          className="w-10 h-10 text-white dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Chatbox;
