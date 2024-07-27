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
      className="absolute bottom-5 right-5 h-16 w-16 rounded-xl flex justify-center items-center"
      onPress={onPress}
    >
      <AntDesign name="plus" size={32} color={Colors.dark.background} />
    </Pressable>
  );
};
