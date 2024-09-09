import jokes from "@/data/jokes";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { jokeId: string } }
) {
  if (jokes.length >= parseInt(params.jokeId)) {
    const joke = jokes.find((j) => j.id === parseInt(params.jokeId));
    return NextResponse.json(joke);
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("jokes")
    .select("id, joke, source, author")
    .eq("id", params.jokeId)
    .single();

  if (error && error.code === "PGRST116") {
    return NextResponse.json({ error: "Joke not found" }, { status: 404 });
  }

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  request: Request,
  { params }: { params: { jokeId: string } }
) {
  if (jokes.length >= parseInt(params.jokeId)) {
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("jokes")
    .delete()
    .eq("id", params.jokeId)
    .select();

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (data.length === 0) {
    return NextResponse.json({ error: "Joke not found" }, { status: 404 });
  }

  return NextResponse.json({
    message: `Joke with ID ${params.jokeId} deleted successfully`,
  });
}
