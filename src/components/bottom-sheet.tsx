import { Colors } from "@/constants";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";

interface BottomSheetProps {
  children: React.ReactNode;
  initialPosition?: number;
}

export const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, initialPosition = 30 }, ref) => {
    // Memoize snapPoints for better performance
    const snapPoints = useMemo(
      () => [`${initialPosition}%`, "50%"],
      [initialPosition]
    );

    const blurBackdropComponent = () => {
      return (
        <View style={StyleSheet.absoluteFill}>
          <BlurView
            intensity={80}
            style={StyleSheet.absoluteFill}
            tint="dark"
          />
        </View>
      );
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.modal}
        handleIndicatorStyle={styles.indicator}
        backdropComponent={blurBackdropComponent}
      >
        <BottomSheetView style={styles.view}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.dark.muted,
    color: Colors.dark.foreground,
  },
  indicator: {
    backgroundColor: Colors.dark.foreground,
  },
  view: {
    padding: 10,
    paddingHorizontal: 20,
  },
});

BottomSheet.displayName = "BottomSheet";
