import { Colors } from "@/constants";
import { AntDesign } from "@expo/vector-icons";
import * as React from "react";
import { Pressable } from "react-native";

interface AddNewAlbumButtonProps {
  onPress: () => void;
}

export const AddNewAlbumButton: React.FC<AddNewAlbumButtonProps> = ({
  onPress,
}) => {
  return (
    <Pressable
      style={{ backgroundColor: Colors.dark.primary }}
      className="absolute flex items-center justify-center w-16 h-16 bottom-20 right-5 rounded-xl"
      onPress={onPress}
    >
      <AntDesign name="plus" size={32} color={Colors.dark.background} />
    </Pressable>
  );
};
