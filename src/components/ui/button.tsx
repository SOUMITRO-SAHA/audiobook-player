import { Colors } from "@/constants";
import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

const variants = {
  default: {
    button: { backgroundColor: Colors.dark.primary },
    text: { color: Colors.dark.foreground },
  },
  destructive: {
    button: { backgroundColor: Colors.dark.destructive },
    text: { color: Colors.dark.foreground },
  },
  outline: {
    button: {
      borderColor: Colors.dark.primary,
      borderWidth: 1,
      backgroundColor: Colors.dark.background,
    },
    text: { color: Colors.dark.primary },
  },
  secondary: {
    button: { backgroundColor: Colors.dark.secondary },
    text: { color: Colors.dark.foreground },
  },
  ghost: {
    button: { backgroundColor: "transparent" },
    text: { color: Colors.dark.foreground },
  },
  link: {
    button: { backgroundColor: "transparent" },
    text: { color: Colors.dark.primary, textDecorationLine: "underline" },
  },
};

const sizes = {
  default: {
    button: { height: 40, paddingHorizontal: 16, paddingVertical: 8 },
    text: { fontSize: 14 },
  },
  sm: {
    button: { height: 36, paddingHorizontal: 12, paddingVertical: 6 },
    text: { fontSize: 12 },
  },
  lg: {
    button: { height: 48, paddingHorizontal: 24, paddingVertical: 12 },
    text: { fontSize: 16 },
  },
  icon: {
    button: {
      height: 40,
      width: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    text: { fontSize: 14 },
  },
};

type ButtonType = "TouchableOpacity" | "TouchableHighlight";

interface ButtonProps extends TouchableOpacityProps, TouchableHighlightProps {
  title?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  type?: ButtonType;
}

export const Button: React.FC<ButtonProps> = ({
  title = "Save",
  variant = "default",
  size = "default",
  style,
  textStyle,
  type = "TouchableOpacity",
  ...props
}) => {
  const variantStyles = variants[variant];
  const sizeStyles = sizes[size];

  // const ButtonComponent = (() => {
  //   switch (type) {
  //     case "TouchableOpacity":
  //       return TouchableOpacity;
  //     case "TouchableHighlight":
  //       return TouchableHighlight;
  //     default:
  //       return TouchableOpacity;
  //   }
  // })();

  return (
    <TouchableOpacity {...props}>
      <View style={[styles.button, variantStyles.button]}>
        <Text
          style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: "800",
    letterSpacing: 0.25,
  },
});
