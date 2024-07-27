import React from "react";
import { ThemedView } from "../ThemedView";
import { TextInput } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  text: string;
  onChangeText?: (text: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = (props) => {
  return (
    <ThemedView className="flex-row space-x-3 border w-full bg-slate-700/80 p-2 px-3 rounded-xl justify-center items-center blur-2xl">
      <AntDesign name="search1" size={24} color={Colors.dark.primary} />
      <TextInput
        className={cn("h-11 text-white w-[90%] dark:bg-slate-900 rounded px-2")}
      />
    </ThemedView>
  );
};
