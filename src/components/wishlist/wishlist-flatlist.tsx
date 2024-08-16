import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Book } from "@/context/AppContext";
import { useRouter } from "expo-router";

interface WishListFlatlistProps {
  data: Book[];
}

export const WishListFlatlist: React.FC<WishListFlatlistProps> = ({ data }) => {
  const router = useRouter();

  // Function to handle card press
  const handleCardPress = (bookId: string) => {
    router.navigate({
      pathname: "/(wishlist)/[param]",
      params: { id: bookId },
    });
  };

  // Render Book Card
  const renderItem = ({ item }: { item: Book }) => {
    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item.id)}
        style={styles.card}
      >
        <ThemedView style={styles.cardContent}>
          {item.coverImage && (
            <Image
              source={{ uri: item.coverImage }}
              style={styles.coverImage}
            />
          )}
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          <ThemedText style={styles.author}>
            {item.authors.join(", ") || "Unknown"}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      style={{
        height: 325,
      }}
      ListFooterComponent={() => {
        if (data.length > 0)
          return (
            <TouchableOpacity activeOpacity={0.7}>
              <ThemedView className="flex items-center justify-center p-3 mt-3 bg-slate-800/80 rounded-xl">
                <ThemedText className="text-gray-400">
                  End of the List
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          );
      }}
      ListEmptyComponent={() => (
        <ThemedView className="flex items-center justify-center p-3 py-6 mt-6 bg-slate-800/80 rounded-xl">
          <ThemedText className="text-gray-400 ">
            Use the search bar to find books
          </ThemedText>
        </ThemedView>
      )}
      showsVerticalScrollIndicator={false}
      onEndReachedThreshold={0.1}
      contentContainerStyle={styles.container}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  card: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
  },
  cardContent: {
    padding: 10,
    alignItems: "center",
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  author: {
    fontSize: 14,
    color: "#555",
  },
});
