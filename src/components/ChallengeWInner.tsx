import { cn } from "@/lib/utils";
import React from "react";

interface ChallengeWinnerProps {
  imageSrc: string;
  name: string;
  place: number;
}

const getGradientColors = (place: number) => {
  switch (place) {
    case 1:
      return "from-[#ffd700] to-[#daa520]";
    case 2:
      return "from-[#c0c0c0] to-[#a9a9a9]";
    case 3:
      return "from-[#cd7f32] to-[#8b4513]";
    default:
      return "";
  }
};

const getBorderColors = (place: number) => {
  switch (place) {
    case 1:
      return "border-[#ffd700]";
    case 2:
      return "border-[#c0c0c0]";
    case 3:
      return "border-[#cd7f32]";
    default:
      return "";
  }
};

const ChallengeWinner: React.FC<ChallengeWinnerProps> = ({
  imageSrc,
  name,
  place,
}) => {
  const gradientColors = getGradientColors(place);
  const borderColors = getBorderColors(place);

  return (
    <div className="relative group">
      <div
        className={cn(
          "absolute top-0 left-0 w-full h-full bg-gradient-to-r rounded-full opacity-20 blur-xl group-hover:opacity-50 transition-all duration-300",
          gradientColors
        )}
      />
      <div
        className={cn(
          "relative z-10 bg-background rounded-full w-[150px] h-[150px] flex items-center justify-center border-8",
          borderColors
        )}
      >
        <img
          src={imageSrc}
          alt={`Winner ${place}`}
          width={150}
          height={150}
          className="rounded-full"
          style={{ aspectRatio: "150/150", objectFit: "cover" }}
        />
      </div>
      <h3 className="mt-4 text-xl text-white font-bold text-center">{name}</h3>
    </div>
  );
};

export default ChallengeWinner;
