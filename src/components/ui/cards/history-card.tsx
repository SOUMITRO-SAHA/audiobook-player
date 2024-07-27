import { ThemedView } from "@/components/ThemedView";
import React from "react";

interface HistoryCardProps {
  coverImage?: string;
  title?: string;
  subtitle?: string;
  timestamp?: number;
}

export const HistoryCard: React.FC<HistoryCardProps> = (props) => {
  return <ThemedView>HistoryCard</ThemedView>;
};
