import {
  ThemedButton,
  ThemedScreen,
  ThemedText,
  ThemedView,
} from "@/components";
import { Colors } from "@/constants";
import { useAppContext } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const BookInfoScreen = () => {
  const { getBookById } = useAppContext();
  const { id } = useLocalSearchParams();

  const book = React.useMemo(() => {
    if (id) return getBookById(id as string);
  }, [id]);

  const router = useRouter();

  const handleAddToWishlist = () => {
    console.log("Book added to wishlist");
  };

  return (
    <ThemedScreen style={styles.screen}>
      <TouchableOpacity
        activeOpacity={0.3}
        onPress={() => {
          router.back();
        }}
        className="p-2"
      >
        <Feather name="arrow-left" size={24} color={Colors.dark.foreground} />
      </TouchableOpacity>

      <ScrollView
        className={cn(
          book && book.description && book.description?.length > 300 && "mb-32"
        )}
      >
        <ThemedView style={styles.container}>
          {/* Book Cover Image */}
          <Image
            source={{
              uri: book?.coverImage ?? "https://via.placeholder.com/150",
            }}
            style={styles.coverImage}
            resizeMode="cover"
          />

          {/* Book Title */}
          <ThemedText style={styles.title}>{book?.title}</ThemedText>

          {/* Book Author */}
          <ThemedText style={styles.author}>
            {book?.authors?.join(", ")}
          </ThemedText>

          {/* Book Description */}
          <ThemedText style={styles.description}>
            {book?.description}
          </ThemedText>

          {/* Add to Wishlist Button */}
          <ThemedButton
            onPress={handleAddToWishlist}
            style={styles.wishlistButton}
            variant="default"
            size="full"
          >
            <FontAwesome6 name="add" size={24} color={Colors.dark.foreground} />
            <ThemedText style={styles.wishlistButtonText}>
              Add to Wishlist
            </ThemedText>
          </ThemedButton>
        </ThemedView>
      </ScrollView>
    </ThemedScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 16,
  },
  container: {
    alignItems: "center",
  },
  coverImage: {
    width: 150,
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  author: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  wishlistButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    gap: 15,
  },
  wishlistButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default BookInfoScreen;
