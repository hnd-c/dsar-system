import { AlertCircle, CheckCircle2 } from "lucide-react";

export type Message = {
  type?: string;
  message?: string;
} | null;

export function FormMessage({ message }: { message: Message }) {
  if (!message) return null;

  return (
    <div
      className={`mt-4 p-3 rounded-md flex items-center gap-2 text-sm ${
        message.type === "error"
          ? "bg-destructive/15 text-destructive"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      {message.type === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle2 className="h-4 w-4" />
      )}
      {message.message}
    </div>
  );
}
