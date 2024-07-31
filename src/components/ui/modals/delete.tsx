import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface DeleteModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleDeleteFun: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen = false,
  setIsOpen = () => {},
  handleDeleteFun = () => {},
}) => {
  return (
    <Modal
      visible={isOpen}
      onRequestClose={() => setIsOpen(!isOpen)}
      animationType="fade"
      transparent
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} style={styles.blurView} tint="dark">
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.text}>
              Are you sure you want to delete this folder?
            </ThemedText>
            <ThemedText style={styles.smallText} className="text-slate-400">
              Deleting this folder will only remove it from this application.
              The folder will remain in your local storage.
            </ThemedText>

            <ThemedView style={styles.buttonContainer} className="">
              <TouchableOpacity
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                <ThemedView style={styles.cancelButton}>
                  <ThemedText className="text-black">Cancel</ThemedText>
                </ThemedView>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteFun}>
                <ThemedView style={styles.deleteButton}>
                  <ThemedText style={styles.buttonText}>Delete</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    backgroundColor: Colors.dark.muted,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
  },
  text: {
    color: Colors.dark.foreground,
    fontSize: 18,
    marginBottom: 20,
  },
  smallText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 22,
  },
  buttonContainer: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.dark.foreground,
    borderRadius: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.light.destructive,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
