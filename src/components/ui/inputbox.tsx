import { cn } from "@/lib/utils";
import React from "react";
import { TextInput } from "react-native";

interface InputBoxProps {
  state: string;
  setState: (value: string) => void;
  className?: string;
}

export const InputBox: React.FC<InputBoxProps> = (props) => {
  return (
    <TextInput
      className={cn(
        "h-11 w-full bg-white px-3 text-base font-[700] rounded-lg",
        props.className
      )}
      value={props.state}
      onChangeText={(value) => {
        props.setState(value);
      }}
    />
  );
};
