import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = createClient();

  
let { data: events, error } = await supabase
.from('events')
.select('*')
        
  console.log(events)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     Hello World
    </main>
  );
}
