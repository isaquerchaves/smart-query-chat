import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
        isUser 
          ? "bg-chat-user-bg text-chat-user-text ml-4" 
          : "bg-chat-bot-bg text-chat-bot-text mr-4"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        <p className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-right" : "text-left"
        )}>
          {timestamp.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};