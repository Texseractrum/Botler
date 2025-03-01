"use client";

import { useState } from "react";
import { sendWhatsAppMessage } from "@/app/actions/sendWhatsApp";

interface CardProps {
  id: string;
  title: string;
  roomNumber?: string;
  onTimeSelect: (minutes: number) => void;
  onComplete: (id: string) => void;
}

export default function Card({
  id,
  title,
  roomNumber,
  onTimeSelect,
  onComplete,
}: CardProps) {
  const [status, setStatus] = useState<"pending" | "scheduled">("pending");

  const handleTimeSelect = async (minutes: number) => {
    try {
      // First, call the provided onTimeSelect handler
      await onTimeSelect(minutes);

      // Update status to scheduled
      setStatus("scheduled");

      // Then, send the WhatsApp message
      const result = await sendWhatsAppMessage(title, roomNumber, minutes);

      if (!result.success) {
        console.error("Failed to send WhatsApp message");
      }
    } catch (error) {
      console.error("Error handling time selection:", error);
    }
  };

  const handleComplete = () => {
    onComplete(id);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm mb-4 relative">
      <div
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
          status === "pending" ? "bg-red-500" : "bg-green-500"
        }`}
      />

      <h3 className="text-lg font-medium mb-2">{title}</h3>
      {roomNumber && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Room: {roomNumber}
        </div>
      )}
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Estimated time:
        </p>
        <div className="flex gap-2">
          {[15, 30, 60].map((minutes) => (
            <button
              key={minutes}
              onClick={() => handleTimeSelect(minutes)}
              className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
            >
              {minutes} min
            </button>
          ))}
        </div>

        <button
          onClick={handleComplete}
          className="mt-4 w-full px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
        >
          Completed
        </button>
      </div>
    </div>
  );
}
