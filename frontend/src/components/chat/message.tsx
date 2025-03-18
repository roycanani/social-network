import { cn } from "../../lib/utils"
import { format } from "date-fns"

interface MessageProps {
  message: {
    _id?: string
    chat: string;
    sender: string;
    content: string;
    createdAt: Date;
  }
  isOwn: boolean
}

export function Message({ message, isOwn }: MessageProps) {
  const time = format(new Date(message.createdAt), "h:mm a")

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-2 text-sm",
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p>{message.content}</p>
        <p className={cn("text-xs mt-1 text-right", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {time}
        </p>
      </div>
    </div>
  )
}

