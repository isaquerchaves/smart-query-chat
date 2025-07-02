import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatResponse {
  query_gerada?: string;
  dados?: any[];
  resposta: string;
}

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.resposta,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro de Conexão",
        description: "Não foi possível conectar ao servidor. Verifique se o endpoint está rodando em http://localhost:8000/chat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col">
      <Card className="flex-1 flex flex-col bg-chat-container border-border shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-primary">
          <h1 className="text-2xl font-bold text-primary-foreground">Chat IA</h1>
          <p className="text-primary-foreground/80 text-sm">
            Converse com a inteligência artificial
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p>Olá! Como posso te ajudar hoje?</p>
            </div>
          )}
          
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-chat-bot-bg text-chat-bot-text rounded-lg px-4 py-3 mr-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </Card>
    </div>
  );
};