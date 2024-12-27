import { Button } from "@/components/ui/button";
import { Home, Building, Trees, MapPin } from "lucide-react";
import { useState } from "react";
import Pawn from "./Pawn";

interface Location {
  id: string;
  x: number;
  y: number;
  type: string;
  connections: {
    in: string
    to: string;
    color: string;
  }[];
}

interface MapProps {
  locations: Location[];
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
}

export default function Map({ locations, selectedNode, onNodeClick }: MapProps) {
  const [currentNodeId, setCurrentNodeId] = useState("1"); // Node de départ

  // Récupérer le node actuel
  const currentNode = locations.find((location) => location.id === currentNodeId);

  if (!currentNode) {
    console.error("Node actuel invalide");
    return null;
  }

  return (
    <>
      {/* Lignes de connexion interactives */}
      <svg className="absolute inset-0 w-full h-full">
        {locations.map((location) =>
          location.connections.map((connection) => {
            const targetLocation = locations.find((n) => n.id === connection.to);
            if (!targetLocation) return null;

            return (
              <g key={`${location.id}-${connection.to}`} style={{ cursor: "pointer" }}>
                {/* Ligne invisible pour la hitbox */}
                <line
                  x1={location.x}
                  y1={location.y}
                  x2={targetLocation.x}
                  y2={targetLocation.y}
                  stroke="transparent"
                  strokeWidth="10" // Largeur cliquable
                  onClick={() => {
                    console.log(connection, currentNode);
                    if (currentNode.id !== connection.in && currentNode.id === connection.to)
                      setCurrentNodeId(connection.in);
                    else if (currentNode.id !== connection.to && currentNode.id === connection.in)
                      setCurrentNodeId(connection.to);
                  }}
                />

                {/* Ligne visible pour l'esthétique */}
                <line
                  x1={location.x}
                  y1={location.y}
                  x2={targetLocation.x}
                  y2={targetLocation.y}
                  className={`stroke-2 stroke-dashed ${connection.color}`}
                  strokeDasharray="6, 4"
                />
              </g>
            );
          })
        )}
      </svg>


      {/* Boutons pour les nodes */}
      {locations.map((location) => (
        <Button
          key={location.id}
          variant="outline"
          className={`
            absolute flex items-center justify-center w-20 h-20 -translate-x-1/2 -translate-y-1/2
            bg-gradient-to-b from-gray-300 to-gray-500
            shadow-[0_6px_10px_rgba(0,0,0,0.2)]
            border-none
            transition-transform transition-colors duration-300
            ${selectedNode === location.id ? "ring-4 ring-yellow-400 scale-110" : ""}
            hover:scale-105 hover:bg-green-500 hover:from-green-400 hover:to-green-600
          `}
          style={{
            left: location.x,
            top: location.y,
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
          onClick={() => onNodeClick(location.id)}
        >
          <div
            className="flex items-center justify-center w-full h-full bg-gradient-to-b from-blue-500 to-blue-700 rounded-none transition-colors duration-300"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            {(() => {
              switch (location.type) {
                case "home":
                  return <Home className="w-8 h-8 text-white" />;
                case "building":
                  return <Building className="w-8 h-8 text-white" />;
                case "location":
                  return <Trees className="w-8 h-8 text-white" />;
                case "map":
                  return <MapPin className="w-8 h-8 text-white" />;
                default:
                  return null;
              }
            })()}
          </div>
        </Button>
      ))}

      {/* Pion */}
      <Pawn x={currentNode.x} y={currentNode.y} />
    </>
  );
}
