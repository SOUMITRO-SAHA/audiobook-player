import { Colors } from "@/constants";
import * as Toast from "react-native-root-toast";

/**
 * This function will display the toast message
 * @param message string
 */
export const toast = ({
  message,
  duration = "s",
  variant = "default",
}: {
  message: string;
  duration?: "l" | "s";
  variant?: "default" | "success" | "error" | "info";
}) => {
  const backgroundColor = {
    default: Colors.light.primary,
    success: "green",
    error: "red",
    info: "blue",
  };
  const textColor = {
    default: Colors.light.foreground,
    success: "white",
    error: "white",
    info: "white",
  };

  Toast.show(message, {
    duration: duration === "l" ? Toast.durations.LONG : Toast.durations.SHORT,
    backgroundColor: backgroundColor[variant],
    textColor: textColor[variant],
  });

  // You can manually hide the Toast, or it will automatically disappear after a `duration` ms timeout.
  //   setTimeout(function hideToast() {
  //     Toast.hide(toast);
  //   }, 500);
};
