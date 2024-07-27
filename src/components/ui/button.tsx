import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants";

interface ButtonProps {
  onPress: () => void;
  title?: string;
}

export function Button(props: ButtonProps) {
  const { onPress, title = "Save" } = props;

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <ThemedText style={styles.text}>{title}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: Colors.dark.primary,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
    letterSpacing: 0.25,
    color: "#000",
  },
});
