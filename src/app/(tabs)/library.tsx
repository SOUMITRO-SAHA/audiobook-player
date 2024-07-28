import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AddNewAlbumButton, LibraryCard } from "@/components/ui";
import { Colors } from "@/constants";
import { fetchAllFolders } from "@/lib/db/query";
import {
  addNewFolder,
  addSubfolderUnderMainFolder,
} from "@/lib/services/file-system";
import { cn } from "@/lib/utils";
import { resetIsLoading, selectFolder } from "@/store/slice";
import { Folder } from "@/types/database";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function LibraryScreen() {
  const [refreshCount, setRefreshCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [folders, setFolders] = useState<Folder[] | null>(null);

  // Redux
  const { loading } = useSelector(selectFolder);
  const dispatch = useDispatch();

  // Function
  const handleAddNewAlbum = async () => {
    await addNewFolder();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    dispatch(resetIsLoading());
    try {
      const res = await addSubfolderUnderMainFolder();
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

  const renderLibraryCards = () => {
    return (
      <ThemedView>
        <FlatList
          data={folders}
          renderItem={({ item }) => {
            return <LibraryCard {...item} />;
          }}
          ItemSeparatorComponent={() => {
            return <ThemedView style={{ height: 5 }} />;
          }}
          ListEmptyComponent={() => (
            <ThemedView className="flex items-center justify-center p-3 mt-6 bg-slate-800/80 rounded-xl">
              <ThemedText className="mt-6 text-gray-400">
                No Content Found!!!
              </ThemedText>
              {refreshCount <= 3 ? (
                <>
                  <ThemedText className="mt-1 text-xl text-gray-300">
                    Pull down to Refresh
                  </ThemedText>
                  <ThemedView className="p-3 mt-3 rounded-full bg-black/40">
                    <AntDesign
                      name="arrowdown"
                      size={28}
                      color={Colors.dark.primary}
                    />
                  </ThemedView>
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
      <ThemedView>{loading && renderLoadingCard()}</ThemedView>

      {/* Add button */}
      <AddNewAlbumButton onPress={handleAddNewAlbum} />
    </ParallaxScrollView>
  );
}
