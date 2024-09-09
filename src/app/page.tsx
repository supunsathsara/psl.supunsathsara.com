import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-neutral-950 to-neutral-800 items-center justify-between p-24">
      <div className="flex flex-col gap-2 items-center justify-center w-full">
      <TextHoverEffect text="Postman Student Community" size="md" />
      <TextHoverEffect text="NIBM" size="md" />
      </div>
      <Image src="/API-early.png" alt="api-101" width={400} height={400} />
      <div className="flex flex-col gap-8 items-center justify-center">
        <Link href="https://dub.sh/nibm-pse" className="z-10">
          <Button>
            Become a Postman Student Expert
          </Button>
        </Link>

      </div>
      <ShootingStars maxSpeed={20} maxDelay={3000}/>
    </main>
  );
}
