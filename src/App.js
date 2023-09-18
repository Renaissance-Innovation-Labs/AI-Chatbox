import { useState, useEffect, useRef } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  console.log(messages);
  const callOpenaiAPI = async () => {
    setMessages([...messages, { role: "system", content: input }]);
    setInput("");
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: [{ role: "system", content: input }],
        max_tokens: 500,
        temperature: 0,
      });

      setMessages((prev) => [...prev, completion.choices[0].message]);
      setIsThinking(false);
    } catch (error) {
      setIsThinking(false);
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  const onSubmitAction = () => {
    if (!input) return;
    setIsThinking(true);
    setMessages([...messages, { role: "user", content: input }]);
    callOpenaiAPI();
  };

  const preloadSVG = (
    <>
      <svg
        className="inline w-8 h-8 mr-2 text-white animate-spin fill-blue-600"
        aria-hidden="true"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="text-white opacity-70">Loading...</span>
    </>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    input && callOpenaiAPI();
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="relative max-w-3xl space-y-5 mx-auto my-5 min-h-[cal(100vh_-_150px)] pb-[170px]">
        {messages.map((messages, i) => (
          <div
            ref={messagesEndRef}
            key={i}
            className={`p-3 max-w-3x rounded-lg w-4/5 overflow-y-auto whitespace-normal text-white my-2  ${
              messages.role !== "assistant"
                ? "bg-blue-600 "
                : "bg-gray-900 ml-auto"
            }`}
          >
            {messages.content}
          </div>
        ))}
        {isThinking && (
          <div className="p-3 max-w-full text-white my-2 ml-auto">
            {preloadSVG}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 bg-gray-900 flex items-center h-[150px] p-2 w-full md:p-8">
        <div className="mx-auto flex justify-bottom max-w-3xl">
          <textarea
            placeholder="Send a chat"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow p-2 rounded-lg mr-2 w-[70vw] md:text-xl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey === false) {
                e.preventDefault();
                input && onSubmitAction();
              }
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

      {!messages.length && (
        <div
          className="absolute top-[200px]
          transform-translate-x-1/2 max-w-[500px] pl-6 pr-6 md:left-1/3"
        >
          <h1 className="font-black text-white text-4xl">ChatBot</h1>
          <p className="text-white mt-2">
            Hello there! I'm Chatbot, a language model trained to assist you
            with various topics and questions. What can i help you with today?
            Feel free to type your query or topic of interest, and i'll do my
            best to provide you with helpful and informative responses.
          </p>
        </div>
      )}
    </>
  );
}

export default App;
