"use client";

import { useState } from "react";
import { createCard, CardData } from "@/app/actions/createCard";
import { useCardStore } from "@/app/store/cards";

interface CreateCardFormProps {
  onSuccess?: () => void;
}

export default function CreateCardForm({ onSuccess }: CreateCardFormProps) {
  const addCard = useCardStore((state) => state.addCard);
  const [formData, setFormData] = useState<CardData>({
    title: "",
    roomNumber: "",
    columnType: "maintenance",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("CreateCardForm - Submitting form data:", formData);

    // Convert columnType to type for API consistency
    const apiData = {
      ...formData,
      type: formData.columnType,
    };

    const result = await createCard(apiData);
    console.log("CreateCardForm - API response:", result);

    if (result.success && result.data) {
      console.log("CreateCardForm - Adding card to store:", result.data);
      // Add the new card to the store
      addCard(result.data);

      // Reset form
      setFormData({
        title: "",
        roomNumber: "",
        columnType: "maintenance",
      });

      // Call success callback if provided
      onSuccess?.();
    } else {
      console.error("Failed to create card:", result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
          required
        />
      </div>

      <div>
        <label
          htmlFor="roomNumber"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Room Number
        </label>
        <input
          type="text"
          id="roomNumber"
          value={formData.roomNumber}
          onChange={(e) =>
            setFormData({ ...formData, roomNumber: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
        />
      </div>

      <div>
        <label
          htmlFor="columnType"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Type
        </label>
        <select
          id="columnType"
          value={formData.columnType}
          onChange={(e) =>
            setFormData({
              ...formData,
              columnType: e.target.value as CardData["columnType"],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-zinc-700 dark:border-zinc-600"
        >
          <option value="maintenance">Maintenance</option>
          <option value="event">Event</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create Card
      </button>
    </form>
  );
}
