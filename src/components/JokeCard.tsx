import React from "react";
import { Button } from "./ui/button";
import { deleteJoke } from "@/lib/actions";

interface JokeCardProps {
  id: number;
  joke: string;
  author: string;
  source: string | null;
  admin?: boolean;
}

const JokeCard: React.FC<JokeCardProps> = ({
  id,
  joke,
  author,
  source,
  admin,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {admin && (
        <p>
          <span className="text-gray-500">#</span>
          <span className="text-lg font-bold">{id}</span>
        </p>
      )}
      <p className="text-2xl font-medium mb-4">{joke}</p>
      <div className="flex items-center justify-between">
        <p className="text-gray-500 font-medium">{author}</p>
        <p className="text-gray-500 font-medium">{source}</p>
      </div>
      {admin && (
        <div className="mt-4">
          <Button
            variant="destructive"
            onClick={async () => await deleteJoke(id)}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default JokeCard;
