import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-border bg-card">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1 bg-input border-border focus:ring-ring"
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon"
        disabled={!message.trim() || isLoading}
        className="bg-gradient-primary hover:opacity-90 transition-opacity"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};