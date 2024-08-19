import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Book } from "@/types/book";

export const TrendingSection = ({ books }: { books: Book[] }) => {
  const router = useRouter();

  const handlePress = (book: Book) => {
    router.push({
      pathname: "/(wishlist)/[param]",
      params: { id: book.id },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Trending Books</ThemedText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {books.map((book) => (
          <TouchableOpacity
            key={book.id}
            style={styles.bookContainer}
            onPress={() => handlePress(book)}
          >
            <View>
              <Image
                source={{ uri: book.coverImage }}
                style={styles.coverImage}
                resizeMode="cover"
              />
              <ThemedText style={styles.bookTitle} numberOfLines={1}>
                {book.title}
              </ThemedText>
              <ThemedText style={styles.bookAuthor} numberOfLines={1}>
                {book.authors.join(", ")}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bookContainer: {
    width: 120,
    marginRight: 16,
  },
  coverImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
  },
  bookTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  bookAuthor: {
    fontSize: 12,
    color: "#888",
  },
});

export default TrendingSection;
