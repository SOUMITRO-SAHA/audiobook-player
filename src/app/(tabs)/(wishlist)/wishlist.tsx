import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedScreen, ThemedText, ThemedView } from "@/components";
import { Book } from "@/context/AppContext";
import { useRouter } from "expo-router";
import { Colors } from "@/constants";

const WishListPage = () => {
  const router = useRouter();

  const handleCardPress = (bookId: string) => {
    router.navigate({
      pathname: "/(wishlist)/[param]",
      params: { id: bookId },
    });
  };

  // TODO: Get this for the Database
  const data = [];

  const renderItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item.id)}
      style={styles.card}
    >
      <ThemedView style={styles.cardContent}>
        {item.coverImage && (
          <Image source={{ uri: item.coverImage }} style={styles.coverImage} />
        )}
        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={styles.author}>
          {item.authors.join(", ") || "Unknown"}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedScreen>
      <ThemedView>
        <ThemedText type="title">Wishlist</ThemedText>
      </ThemedView>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1} // Single column layout
        ListFooterComponent={() => {
          if (data.length > 0) {
            return (
              <ThemedView style={styles.footerContainer}>
                <ThemedText className="text-gray-400">
                  End of the List
                </ThemedText>
              </ThemedView>
            );
          }
          return null;
        }}
        ListEmptyComponent={() => (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText className="mt-3 text-gray-400">
              Your wishlist is empty.
            </ThemedText>
          </ThemedView>
        )}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
        contentContainerStyle={styles.container}
      />
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: Colors.dark.muted, // Adjust as needed
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  coverImage: {
    width: 50,
    height: 75,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  author: {
    fontSize: 14,
    color: "#666",
  },
  footerContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.muted,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.dark.muted,
    borderRadius: 0.75,
  },
});

export default WishListPage;
