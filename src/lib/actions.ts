"use server";

import { createClient } from "@/utils/supabase/server";

export const deleteJoke = async (id: number) => {
  if (id < 5) {
    return;
  }
  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase.auth.getUser();

  if (sessionError) {
    console.error("Error getting session:", sessionError);
    return;
  }

  if (!session) {
    console.error("No session found");
    return;
  }

  const { data, error } = await supabase.from("jokes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting data:", error);
  }
};
