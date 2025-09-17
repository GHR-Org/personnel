// components/Room2DPlan.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useFurnitureStore } from "@/lib/stores/furniture-store";
import { TableStatus, FurnitureData } from "@/types/table";

interface Props {
  width: number;
  height: number;
}

const getStatusData = (status: TableStatus) => {
  switch (status) {
    case TableStatus.OCCUPE:
      return { color: "#ef4444", label: "Occupé" };
    case TableStatus.LIBRE:
      return { color: "#22c55e", label: "Libre" };
    case TableStatus.RESERVEE:
      return { color: "#f97316", label: "Réservé" };
    case TableStatus.NETTOYAGE:
      return { color: "#3b82f6", label: "Nettoyage" };
    case TableStatus.HORS_SERVICE:
      return { color: "#6b7280", label: "HS" };
    default:
      return { color: "rgba(255,255,255,0.8)", label: "Inconnu" };
  }
};

const getFurnitureSize = (type: string) => {
  switch (type) {
    case "table":
    case "couple":
      return { width: 80, height: 80 };
    case "chaise":
      return { width: 20, height: 20 };
    case "caisse":
      return { width: 50, height: 80 };
    case "family":
      return { width: 60, height: 60 };
    case "exterieur":
      return { width: 80, height: 80 };
    default:
      return { width: 30, height: 30 };
  }
};

export default function Room2DPlan({ width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { previewFurniture, openDrawer } = useFurnitureStore();

  const getFurnitureAtCoordinates = (
    mouseX: number,
    mouseY: number
  ): FurnitureData | undefined => {
    for (let i = previewFurniture.length - 1; i >= 0; i--) {
      const furniture = previewFurniture[i];
      const { type, position } = furniture;
      const { width: itemWidth, height: itemHeight } = getFurnitureSize(type);

      const x = position[0] * 10 + width / 2;
      const z = -position[2] * 10 + height / 2;

      const left = x - itemWidth / 2;
      const right = x + itemWidth / 2;
      const top = z - itemHeight / 2;
      const bottom = z + itemHeight / 2;

      if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
        return furniture;
      }
    }
    return undefined;
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / (rect.width / width);
    const mouseY = (event.clientY - rect.top) / (rect.height / height);

    const clickedItem = getFurnitureAtCoordinates(mouseX, mouseY);
    if (clickedItem) {
      openDrawer(clickedItem);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / (rect.width / width);
    const mouseY = (event.clientY - rect.top) / (rect.height / height);

    // Si on survole un meuble, on met le curseur en 'pointer'
    if (getFurnitureAtCoordinates(mouseX, mouseY)) {
      canvas.style.cursor = "pointer";
    } else {
      // Sinon, on le remet en 'default'
      canvas.style.cursor = "default";
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, width, height);

    previewFurniture.forEach((furniture) => {
      const { name, type, position, status } = furniture;
      const { width: itemWidth, height: itemHeight } = getFurnitureSize(type);
      const { color, label } = getStatusData(status);

      const x = position[0] * 10 + width / 2;
      const z = -position[2] * 10 + height / 2;

      ctx.save();
      ctx.translate(x, z);
      ctx.fillStyle = color;

      ctx.fillRect(-itemWidth / 2, -itemHeight / 2, itemWidth, itemHeight);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      ctx.strokeRect(-itemWidth / 2, -itemHeight / 2, itemWidth, itemHeight);

      if (name) {
        ctx.font = "12px Arial";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(name, 0, -10);
      }

      ctx.font = "10px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 10);

      ctx.restore();
    });
  }, [previewFurniture, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseOut={() => {
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "default";
        }
      }}
    />
  );
}