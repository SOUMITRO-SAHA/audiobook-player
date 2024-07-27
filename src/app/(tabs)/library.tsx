import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AddNewAlbumButton } from "@/components/ui";
import { Colors } from "@/constants";
import { fetchAllFolders } from "@/lib/db/query";
import { addNewFolder } from "@/lib/services/file-system";
import { cn } from "@/lib/utils";
import { resetIsLoading, selectFolder, setIsLoading } from "@/store/slice";
import { Folder } from "@/types/database";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function LibraryScreen() {
  const [folders, setFolders] = useState<Folder[] | null>(null);

  // Redux
  const { loading } = useSelector(selectFolder);
  const dispatch = useDispatch();

  // Function
  const handleAddNewAlbum = async () => {
    dispatch(setIsLoading());
    await addNewFolder();
    dispatch(resetIsLoading());
  };

  // Side Effect
  useEffect(() => {
    const getFolders = async () => {
      const res = await fetchAllFolders();
      if (res) {
        setFolders(res);
      }
    };

    getFolders();
  }, [loading]);

  const renderLoadingCard = () => {
    return (
      <ThemedView className="my-4">
        <ActivityIndicator color={Colors.dark.primary} size={"large"} />
      </ThemedView>
    );
  };

  const renderLibraryCards = (folder: Folder) => {
    return (
      <ThemedView className="p-4 bg-slate-800 rounded-xl">
        <ThemedText>{folder.name}</ThemedText>
      </ThemedView>
    );
  };

  return (
    <ParallaxScrollView>
      <ThemedView className={cn("flex-row")}>
        <ThemedText type="title">Library</ThemedText>
      </ThemedView>

      <ThemedView>
        {folders && folders.map((folder) => renderLibraryCards(folder))}
      </ThemedView>

      {/* For Loading New Card */}
      <ThemedView>{loading && renderLoadingCard()}</ThemedView>

      {/* Add button */}
      <AddNewAlbumButton onPress={handleAddNewAlbum} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    backgroundColor: Colors.dark.primary,
  },
});
