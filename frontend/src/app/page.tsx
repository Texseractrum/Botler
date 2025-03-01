"use client";

import Card from "@/components/Card";
import { useCardStore } from "./store/cards";
import { useEffect, useState } from "react";

export default function Home() {
  const getCardsByType = useCardStore((state) => state.getCardsByType);
  const setCards = useCardStore((state) => state.setCards);
  const allCards = useCardStore((state) => state.cards);
  const removeCard = useCardStore((state) => state.removeCard);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log("removeCard type:", typeof removeCard);
    if (typeof removeCard !== "function") {
      console.error("removeCard is not a function!", removeCard);
    }
  }, [removeCard]);

  const fetchCards = async () => {
    try {
      console.log("Fetching cards from API");
      const response = await fetch("/api/cards", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const result = await response.json();
      console.log("API response:", result);

      if (result.status === "success") {
        console.log("Setting cards in store:", result.data);
        setCards(result.data);

        // Update debug info
        setDebugInfo({
          apiResponseStatus: result.status,
          apiCardCount: result.data.length,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      setDebugInfo({
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toLocaleTimeString(),
      });
    }
  };

  useEffect(() => {
    // Fetch cards immediately on mount
    fetchCards();

    // Set up polling to refresh cards every 3 seconds
    const intervalId = setInterval(fetchCards, 3000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const maintenanceCards = getCardsByType("maintenance");
  const eventCards = getCardsByType("event");
  const otherCards = getCardsByType("other");

  console.log("Current store state:", {
    allCards,
    maintenanceCards,
    eventCards,
    otherCards,
  });

  const handleCardComplete = async (id: string) => {
    console.log(`Completing card with id: ${id}`);

    try {
      // First remove from local store for immediate UI update
      if (typeof removeCard === "function") {
        removeCard(id);
      } else {
        console.error("Cannot complete card: removeCard is not a function");
        const currentCards = [...allCards];
        setCards(currentCards.filter((card) => card.id !== id));
      }

      // Then delete from the server
      const response = await fetch(`/api/cards/${id}`, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        console.error(`Failed to delete card from server: ${response.status}`);
      } else {
        console.log(`Card ${id} successfully deleted from server`);
      }
    } catch (error) {
      console.error("Error completing card:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Service Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Real-time service request monitoring
        </p>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Maintenance Team Column */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-600 dark:text-blue-400">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Maintenance Team
          </h2>
          <div className="space-y-4">
            {maintenanceCards.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p>No maintenance requests</p>
              </div>
            ) : (
              maintenanceCards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  roomNumber={card.roomNumber}
                  onTimeSelect={async (minutes) => {
                    console.log(
                      `Selected ${minutes} minutes for ${card.title}`
                    );
                  }}
                  onComplete={handleCardComplete}
                />
              ))
            )}
          </div>
        </div>

        {/* Event Scheduling Column */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-green-600 dark:text-green-400">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Event Scheduling
          </h2>
          <div className="space-y-4">
            {eventCards.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p>No scheduled events</p>
              </div>
            ) : (
              eventCards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  roomNumber={card.roomNumber}
                  onTimeSelect={async (minutes) => {
                    console.log(
                      `Selected ${minutes} minutes for ${card.title}`
                    );
                  }}
                  onComplete={handleCardComplete}
                />
              ))
            )}
          </div>
        </div>

        {/* Other Column */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-purple-600 dark:text-purple-400">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Other Requests
          </h2>
          <div className="space-y-4">
            {otherCards.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p>No other requests</p>
              </div>
            ) : (
              otherCards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  roomNumber={card.roomNumber}
                  onTimeSelect={async (minutes) => {
                    console.log(
                      `Selected ${minutes} minutes for ${card.title}`
                    );
                  }}
                  onComplete={handleCardComplete}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
