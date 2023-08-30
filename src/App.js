import { useState, useEffect, useRef } from "react";
import OpenAIApi from "openai";

const openai = new OpenAIApi({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const onSubmitAction = () => {
    if (!input) return;
    setIsThinking(true);
    setMessages([...messages, { role: "user", content: "input" }]);
  };

  return (
    <>
      <div className="relative max-w-3xl"></div>
      <div className="fixed bottom-0 bg-gray-900 flex items-center h-[150px] p-2 w-full md:p-8">
        <div className="mx-auto flex justify-bottom max-w-3xl">
          <textarea
            placeholder="Send a chat"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 rounded-lg mr-2 w-[70vw] md:text-xl"
            onKeyDown={(e) => {
              e.preventDefault();
              // if (e.key === "Enter" && e.shiftKey === false) {
              //   input && onSubmitAction();
              // }
            }}
          ></textarea>
          <button
            onClick={onSubmitAction}
            className="bg-blue-600 text-white w-full max-w-[80px] uppercase px-4 py-2 rounded-lg hover:bg-blue-900 md:2xl md:max-w-[150px]"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
