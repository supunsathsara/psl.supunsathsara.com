import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-950 to-neutral-800 items-center justify-between p-24">
      <TextHoverEffect text="API 101 with Postman 🚀" size="lg" />
      <Image src="/API-early.png" alt="api-101" width={600} height={600} />
      <div className="flex flex-row gap-8 items-center justify-center">
        <Link href="/101/jokes" className="z-10">
          <Button>Jokes</Button>
        </Link>
        <Link href="#" className="z-10">
          <Button disabled>Books</Button>
        </Link>
        <Link href="#" className="z-10">
          <Button disabled>Quotes</Button>
        </Link>
      </div>
      <ShootingStars maxSpeed={20} maxDelay={3000}/>
    </main>
  );
}
