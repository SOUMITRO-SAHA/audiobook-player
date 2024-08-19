import { useFocusEffect } from "@react-navigation/native";
import { BackHandler, Alert } from "react-native";
import * as React from "react";
import { takingBackupBeforeClosing } from "@/lib/services/process-data";

export const useBackButtonHandler = (isRootScreen: boolean) => {
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (isRootScreen) {
          Alert.alert(
            "Hold on!",
            "Are you sure you want to close the application?",
            [
              {
                text: "Cancel",
                onPress: () => null,
                style: "cancel",
              },
              {
                text: "YES",
                onPress: async () => {
                  // Take the backup the latest position of the music position to store in the database
                  await takingBackupBeforeClosing();

                  // Close the application
                  BackHandler.exitApp();
                },
              },
            ]
          );
          return true;
        } else {
          // If not the root screen, let the default back action happen (navigate back)
          return false;
        }
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [isRootScreen])
  );
};
