import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ChatInterface } from "@/components/ui/chat-interface";
import { Card } from "@/components/ui/card";
import { Bot, Zap, Shield, Clock } from "lucide-react";

const AIChatBot = () => {
  return (
    <DashboardLayout 
      title="AI ChatBot" 
      subtitle="Get instant help with your placement journey"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-purple-medium/20 border-border/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-lime/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-lime" />
              </div>
              <h3 className="font-semibold text-white">Instant Responses</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Get immediate answers to your placement questions 24/7
            </p>
          </Card>

          <Card className="p-4 bg-purple-medium/20 border-border/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-lime/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-lime" />
              </div>
              <h3 className="font-semibold text-white">AI-Powered</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Advanced AI trained on placement and career guidance
            </p>
          </Card>

          <Card className="p-4 bg-purple-medium/20 border-border/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-lime/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-lime" />
              </div>
              <h3 className="font-semibold text-white">Private & Secure</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your conversations are private and securely handled
            </p>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="border-border/20 bg-purple-dark/30 backdrop-blur-sm overflow-hidden">
          <div className="h-[600px]">
            <ChatInterface />
          </div>
        </Card>

        {/* Help Section */}
        <Card className="p-6 bg-purple-medium/20 border-border/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime/20 flex items-center justify-center flex-shrink-0 mt-1">
              <Clock className="w-4 h-4 text-lime" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">How to get the best help:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Be specific about your questions (e.g., "How to write a software engineer resume?" instead of "Help with resume")</li>
                <li>Ask about interview preparation for specific roles or companies</li>
                <li>Request guidance on application strategies and timelines</li>
                <li>Get advice on skill development and career planning</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIChatBot;
