import { Colors } from "@/constants";
import { cn } from "@/lib/utils";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ThemedButtonProps {
  title?: string; // Title is now optional
  onPress: () => void;
  variant?: "default" | "secondary" | "ghost";
  size?: "sm" | "lg" | "full" | "icon";
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode; // Add the children prop
  className?: string;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = "default",
  size = "sm",
  style,
  textStyle,
  children,
  className,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        variant === "ghost" && styles.ghost,
        sizeStyles[size],
        style,
      ]}
      className={cn("", className)}
      onPress={onPress}
    >
      {children ? (
        children
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#03dac6",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

const sizeStyles = StyleSheet.create({
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  full: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  icon: {
    padding: 8,
    borderRadius: 50,
  },
});
