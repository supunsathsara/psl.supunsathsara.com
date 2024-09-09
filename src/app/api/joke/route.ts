import { NextResponse } from "next/server";
import jokes from "@/data/jokes";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  //send a random joke
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  return NextResponse.json(randomJoke);
}

export async function POST(request: Request) {
  //create a new joke
  const { joke, source, author } = await request.json();

  const supabase = createClient();

  const { data, error } = await supabase
    .from("jokes")
    .insert([{ joke, source, author }])
    .select();

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json(data?.[0], { status: 201 });
}

export async function PUT(request: Request) {
  //update a joke
  const { id, joke, source, author } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Joke ID is required" }, { status: 400 });
  }

  if (!joke) {
    return NextResponse.json({ error: "Joke is required" }, { status: 400 });
  }

  if (!author) {
    return NextResponse.json({ error: "Author is required" }, { status: 400 });
  }

  if (id <= jokes.length) {
    //HARD CODED JOKES. ACCESS DENIED
    return NextResponse.json({ error: "Access Denied" }, { status: 403 });
  }

  const supabase = createClient();

  const { data, error } = await supabase
    .from("jokes")
    .update({ joke, source, author })
    .eq("id", id)
    .select("id, joke, source, author");

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  if (data?.length === 0) {
    return NextResponse.json({ error: "Joke not found" }, { status: 404 });
  }

  return NextResponse.json(data?.[0]);
}
