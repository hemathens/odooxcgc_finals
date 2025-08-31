import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ui/chat-message";
import { ChatInput } from "@/components/ui/chat-input";
import { TypingIndicator } from "@/components/ui/typing-indicator";
import { Card } from "@/components/ui/card";
import { Bot, Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/components/ui/chat-message";
import { generateChatResponse, getRandomSuggestion } from "@/lib/chatbot-logic";

interface ChatInterfaceProps {
  className?: string;
}

// Sample welcome message and suggestions
const welcomeMessage: ChatMessageType = {
  id: "welcome",
  content: "Hello! I'm your AI placement assistant. I can help you with:\n\n• Resume writing and optimization\n• Interview preparation tips\n• Job search strategies\n• Application tracking advice\n• Career guidance\n• Company research\n\nWhat would you like to know?",
  role: "assistant",
  timestamp: new Date()
};

const suggestionQuestions = [
  "How can I improve my resume?",
  "What should I expect in a technical interview?",
  "How do I track my job applications effectively?",
  "Tips for preparing for placement season"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className }) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([welcomeMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestionQuestions, setSuggestionQuestions] = useState<string[]>(getRandomSuggestion());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate a small delay for realistic feel
    setTimeout(() => {
      // Generate AI response using rule-based logic
      const chatResponse = generateChatResponse(content);
      
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: chatResponse.content,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update suggestions if provided
      if (chatResponse.suggestions) {
        setSuggestionQuestions(chatResponse.suggestions);
      }
      
      setIsLoading(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/20 bg-purple-medium/20">
        <div className="w-10 h-10 rounded-full bg-lime flex items-center justify-center">
          <Bot className="w-5 h-5 text-purple-dark" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Placement Assistant</h3>
          <p className="text-sm text-muted-foreground">Your personal career guidance companion</p>
        </div>
        <Sparkles className="w-5 h-5 text-lime ml-auto" />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        {/* Suggestion Cards (show only when there are few messages) */}
        {messages.length <= 1 && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            {suggestionQuestions.map((question, index) => (
              <Card
                key={index}
                className="p-3 bg-purple-medium/30 border-border/20 hover:bg-purple-medium/40 cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => handleSuggestionClick(question)}
              >
                <p className="text-white/90 text-sm">{question}</p>
              </Card>
            ))}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};
