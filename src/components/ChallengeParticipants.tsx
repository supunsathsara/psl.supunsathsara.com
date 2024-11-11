import React from "react";

interface ChallengeParticipantsProps {
  place: number;
  imageSrc: string;
  name: string;
}

const ChallengeParticipants: React.FC<ChallengeParticipantsProps> = ({
  imageSrc,
  name,
  place,
}) => {
  return (
    <div className="bg-background/55 rounded-lg shadow-lg overflow-hidden z-10">
      <div className="flex items-center justify-center p-3">
        <img
          src={imageSrc}
          alt={`Participant ${name}`}
          width={100}
          height={100}
          className="rounded-full"
          style={{ aspectRatio: "100/100", objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = `https://placehold.co/300x300/png?text=${name
              .split(" ")
              .map((word) => word[0])
              .join("")}`;
          }}
        />
      </div>
      <div className="px-4 text-center">
        <h5 className="text-sm font-bold">{place}</h5>
        <h4 className="text-lg font-bold">{name}</h4>
      </div>
    </div>
  );
};

export default ChallengeParticipants;
