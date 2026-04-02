import { useChat } from "@ai-sdk/react";
import { env } from "@SkillSync-1/env/web";
import { DefaultChatTransport } from "ai";
import { Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Streamdown } from "streamdown";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AI: React.FC = () => {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${env.VITE_SERVER_URL}/ai`,
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* 🧠 CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-12 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground">
              <h2 className="text-lg font-medium mb-2">Ask me anything</h2>
              <p className="text-sm">
                I’m your AI assistant for learning & skills 🚀
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.parts?.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <Streamdown
                          key={index}
                          isAnimating={
                            status === "streaming" &&
                            message.role === "assistant"
                          }
                        >
                          {part.text}
                        </Streamdown>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ✍️ INPUT */}
      <div className="border-t bg-background px-4 sm:px-6 lg:px-12 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 border rounded-xl px-3 py-2 shadow-sm bg-background">
            <Input
              name="prompt"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI..."
              className="flex-1 border-0 focus-visible:ring-0 bg-transparent"
              autoComplete="off"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AI;
