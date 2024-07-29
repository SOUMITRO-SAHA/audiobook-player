import { BottomSheet } from "@/components";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AddNewAlbumButton, LibraryCard } from "@/components/ui";
import { Colors } from "@/constants";
import { deleteFolderByFolderId, fetchAllFolders } from "@/lib/db/query";
import { addNewFolder } from "@/lib/services/file-system";
import { cn } from "@/lib/utils";
import {
  resetIsLoading,
  resetLibraryLoading,
  selectFolder,
  selectLibrary,
  setLibraryLoading,
} from "@/store/slice";
import { Folder } from "@/types/database";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function LibraryScreen() {
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [folders, setFolders] = useState<Folder[] | null>(null);
  const [selectedBottomSheetItem, setSelectedBottomSheetItem] = useState<
    number | null
  >(null);

  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Redux
  const { loading } = useSelector(selectFolder);
  const { libraryLoading } = useSelector(selectLibrary);
  const dispatch = useDispatch();

  // Function
  const handleAddNewAlbum = async () => {
    dispatch(setLibraryLoading());
    try {
      await addNewFolder();
    } catch (error) {
      dispatch(resetLibraryLoading());
    } finally {
      dispatch(resetLibraryLoading());
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(resetIsLoading());
    try {
      // const res = await addSubfolderUnderMainFolder();
      // if (res) {
      //   dispatch(setIsLoading());
      // }
    } catch (error) {
    } finally {
      setRefreshing(false);
    }

    // Update `refreshCount`
    if (refreshCount >= 6) {
      setRefreshCount(0);
    } else {
      setRefreshCount((prev) => prev + 1);
    }
  };

  const handleThreeDotPress = (value: number) => {
    bottomSheetModalRef.current?.present();
    setSelectedBottomSheetItem(value);
  };

  const handleDeleteFolder = async (value: number) => {
    dispatch(setLibraryLoading());
    try {
      await deleteFolderByFolderId(value);
    } catch (error) {
      console.error(error);
    } finally {
      bottomSheetModalRef.current?.dismiss();
      setSelectedBottomSheetItem(null);
      dispatch(resetLibraryLoading());
    }
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
  }, [libraryLoading]);

  // Render Components
  const renderLoadingCard = () => {
    return (
      <ThemedView
        className="p-4 rounded-xl"
        style={{ backgroundColor: Colors.dark.muted }}
      >
        <ActivityIndicator color={Colors.dark.primary} size={"large"} />
      </ThemedView>
    );
  };

  const renderLibraryCards = () => {
    return (
      <ThemedView>
        <FlatList
          data={folders}
          renderItem={({ item }) => {
            return (
              <LibraryCard {...item} onPressThreeDots={handleThreeDotPress} />
            );
          }}
          ItemSeparatorComponent={() => {
            return <ThemedView style={{ height: 5 }} />;
          }}
          ListEmptyComponent={() => (
            <ThemedView className="flex items-center justify-center p-3 py-6 mt-6 bg-slate-800/80 rounded-xl">
              <ThemedText className="mt-3 text-gray-400">
                No Content Found!!!
              </ThemedText>
              {refreshCount <= 3 ? (
                <>
                  <ThemedText className="my-3 text-xl text-center text-gray-400">
                    Press the "+" button down below to add a new folder to the
                    application
                  </ThemedText>
                </>
              ) : (
                <>
                  <ThemedText className="mt-4 text-center text-gray-500">
                    There might be no content available in the primary folder
                  </ThemedText>
                </>
              )}
            </ThemedView>
          )}
          ListFooterComponent={({ item }) => {
            if (item) {
              return (
                <ThemedText className="flex flex-row items-center justify-center w-full h-full mt-3 text-xs text-center text-gray-300">
                  End of the List
                </ThemedText>
              );
            } else {
              return null;
            }
          }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </ThemedView>
    );
  };

  return (
    <ParallaxScrollView>
      <ThemedView className={cn("flex-row")}>
        <ThemedText type="title">Library</ThemedText>
      </ThemedView>

      <ThemedView>{renderLibraryCards()}</ThemedView>

      {/* For Loading New Card */}
      <ThemedView>{libraryLoading && renderLoadingCard()}</ThemedView>

      {/* Add button */}
      <AddNewAlbumButton onPress={handleAddNewAlbum} />

      {/* Bottom Sheet Modal */}
      <BottomSheet ref={bottomSheetModalRef}>
        {/* Delete */}
        <TouchableOpacity
          onPress={async () => {
            if (selectedBottomSheetItem)
              await handleDeleteFolder(selectedBottomSheetItem);
          }}
        >
          <ThemedView
            className="flex-row items-center p-2 px-5 space-x-2 rounded-xl"
            style={{ backgroundColor: Colors.dark.card }}
          >
            <MaterialIcons
              name="delete-sweep"
              size={32}
              color={Colors.light.destructive}
            />
            <ThemedText className="text-lg">Delete this Folder</ThemedText>
          </ThemedView>
        </TouchableOpacity>
      </BottomSheet>
    </ParallaxScrollView>
  );
}
