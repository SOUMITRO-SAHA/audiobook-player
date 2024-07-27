import { StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { cn } from "@/lib/utils";
import { AddNewAlbumButton } from "@/components/ui";
import { addNewFolder } from "@/lib/services/file-system";

export default function LibraryScreen() {
  // Function
  const handleAddNewAlbum = async () => {
    await addNewFolder();
  };

  const renderLibraryCards = () => {
    return (
      <ThemedView>
        <ThemedText>Hello</ThemedText>
      </ThemedView>
    );
  };

  return (
    <ParallaxScrollView>
      <ThemedView className={cn("flex-row")}>
        <ThemedText type="title">Library</ThemedText>
      </ThemedView>

      {/* Add button */}
      <AddNewAlbumButton onPress={handleAddNewAlbum} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({});
