import React, { useState } from "react";
import { ThemedView } from "../ThemedView";
import { TextInput, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  text: string;
  onChangeText?: (text: string) => void;
  onSearch?: (text: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  text,
  onChangeText,
  onSearch,
}) => {
  const [inputText, setInputText] = useState(text);

  const handleSubmitEditing = () => {
    if (onSearch) {
      onSearch(inputText);
    }
  };

  return (
    <ThemedView className="flex-row items-center justify-center w-full p-1 px-3 pr-1 space-x-3 border bg-slate-500/30 rounded-xl blur-2xl">
      <AntDesign name="search1" size={24} color={Colors.dark.primary} />
      <TextInput
        className={cn(
          "h-9 text-white w-[90%] dark:bg-slate-950 rounded-r-xl px-2"
        )}
        value={inputText}
        onChangeText={(text) => {
          setInputText(text);
          if (onChangeText) {
            onChangeText(text);
          }
        }}
        onSubmitEditing={handleSubmitEditing}
        returnKeyType="search" // Shows a "search" button on the keyboard
      />
    </ThemedView>
  );
};
