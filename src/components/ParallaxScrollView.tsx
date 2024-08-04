import { ThemedView } from "@/components/ThemedView";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { StyleSheet, ViewStyle } from "react-native";

type Props = PropsWithChildren<{
  className?: string;
  gap?: number;
  style?: ViewStyle;
}>;

export default function ParallaxScrollView({
  children,
  className,
  style,
}: Props) {
  return (
    <ThemedView className={cn("flex-1", className)} style={[style]}>
      <ThemedView
        style={styles.content}
        className={cn("mt-8 flex-1 p-8 bg-background overflow-hidden")}
      >
        {children}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
});
