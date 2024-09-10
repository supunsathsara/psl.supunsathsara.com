"use client";

import ChallengeParticipants from "@/components/ChallengeParticipants";
import ChallengeWinner from "@/components/ChallengeWInner";
import { BackgroundLines } from "@/components/ui/background-lines";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

type Winner = {
  id: string;
  name: string;
  github: string;
};

export default function Component() {

  const [winners, setWinners] = useState<Winner[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from("winners")
        .select("*")
        .order("created_at", { ascending: true});

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setWinners(data);
      }
    };

    fetchInitialData();

    // Set up subscription
    const channel = supabase
      .channel("winner-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "winners" },
        (payload) => {
          setWinners((prevWinners) => [...prevWinners, payload.new as Winner]);
          //console.log('Change received!', payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "winners" },
        (payload) => {
          setWinners((prevWinners) =>
            prevWinners.map((winner) =>
              winner.id === (payload.new as Winner).id
                ? (payload.new as Winner)
                : winner
            )
          );
          //console.log('Update received!', payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "winners" },
        (payload) => {
          setWinners((prevWinners) =>
            prevWinners.filter((winner) => winner.id !== payload.old.id)
          );
          //console.log('Delete received!', payload);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-12 bg-gradient-to-b from-neutral-950 to-neutral-800">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Challenge Winners 🎖️</h2>
      <div className="flex justify-center gap-8 mb-12 z-10">
        {winners.slice(0, 3).map((winner, index) => (
          <ChallengeWinner
            key={winner.name}
            name={winner.name}
            imageSrc={`https://github.com/${winner.github}.png`}
            place={index + 1} // Place is index + 1
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-6">
        {winners.slice(3).map((winner, index) => (
          <ChallengeParticipants
            key={winner.name}
            name={winner.name}
            imageSrc={`https://github.com/${winner.github}.png`}
            place={index + 4} // Place is index + 4
          />
        ))}
      </div>
    </BackgroundLines>
  );
}
