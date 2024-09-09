"use client";
import { useEffect, useState } from "react";
import JokeCard from "@/components/JokeCard";
import { createClient } from "@/utils/supabase/client";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export const dynamic = "force-dynamic";

type Joke = {
  id: number;
  joke: string;
  author: string;
  source: string | null;
};

export default function JokesPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);

  const supabase = createClient();

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from("jokes")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setJokes(data);
      }
    };

    fetchInitialData();

    // Set up subscription
    const channel = supabase
      .channel("jokes-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "jokes" },
        (payload) => {
          setJokes((prevJokes) => [payload.new as Joke, ...prevJokes]);
          //console.log('Change received!', payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "jokes" },
        (payload) => {
          setJokes((prevJokes) =>
            prevJokes.map((joke) =>
              joke.id === (payload.new as Joke).id
                ? (payload.new as Joke)
                : joke
            )
          );
          //console.log('Update received!', payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "jokes" },
        (payload) => {
          setJokes((prevJokes) =>
            prevJokes.filter((joke) => joke.id !== payload.old.id)
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
         <main className="min-h-screen w-full overflow-hidden bg-gradient-to-b from-neutral-950 to-neutral-800">
          <BackgroundBeamsWithCollision className="h-full w-full bg-center overflow-y-auto">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
              {/* <h1 className="text-4xl font-bold text-white mb-8 text-center">
                Postman API 101 Jokes 🚀
              </h1> */}
              <TextHoverEffect text="Postman API 101 Jokes 🚀" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {jokes.map((joke, index) => (
                  <JokeCard
                    id={joke.id}
                    key={index}
                    joke={joke.joke}
                    author={joke.author}
                    source={joke.source}
                  />
                ))}
              </div>
            </div>
          </BackgroundBeamsWithCollision>
        </main>
  );
}
