import { ThemedScreen, ThemedText, ThemedView } from "@/components";
import { Colors } from "@/constants";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";
import { sleep } from "@/lib/utils";
import { Entypo, EvilIcons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  GestureResponderEvent,
  Image,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface WishlistItemType {
  id: number;
  bookId: string;
  title: string;
  author: string;
  coverImage: string | null;
  favorite: boolean | null;
  order: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

const WishListPage = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [favoriteToggleLoading, setFavoriteToggleLoading] = useState<number>(0);
  const [wishlistItems, setWishlistItems] = useState<WishlistItemType[]>([]);

  const router = useRouter();

  // Functions
  const handleCardPress = (bookId: string) => {
    router.navigate({
      pathname: "/(wishlist)/[param]",
      params: { id: bookId },
    });
  };

  const handleMarkAsFavorite = async (
    e: GestureResponderEvent,
    bookDbId: number
  ) => {
    e.stopPropagation();
    setFavoriteToggleLoading(bookDbId);

    try {
      // Check book's current status
      const booksCurrentStatus = await db.query.wishlist.findFirst({
        where: eq(wishlist.id, bookDbId),
      });

      if (booksCurrentStatus) {
        // Update the book's favorite status
        const updatedWishlistItem = await db
          .update(wishlist)
          .set({
            favorite: !booksCurrentStatus.favorite,
          })
          .where(eq(wishlist.id, bookDbId))
          .returning();

        if (updatedWishlistItem.length > 0) {
          const action = updatedWishlistItem[0].favorite
            ? "added to"
            : "removed from";
          ToastAndroid.show(
            `${updatedWishlistItem[0].title} ${action} favorites`,
            ToastAndroid.LONG
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    } finally {
      await sleep(1000);
      setFavoriteToggleLoading(0);
    }
  };

  const handleDelete = async (item: WishlistItemType) => {
    try {
      await db.delete(wishlist).where(eq(wishlist.id, item.id));
      setWishlistItems((prevItems) =>
        prevItems.filter((wishlistItem) => wishlistItem.id !== item.id)
      );

      ToastAndroid.show(`${item.title} deleted`, ToastAndroid.SHORT);
    } catch (error) {
      if (error instanceof Error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    }
  };

  // Side Effects
  React.useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const data = await db.query.wishlist.findMany();

        if (data.length > 0) {
          const formattedWishListItems = data.map((book) => ({
            ...book,
            coverImage: book.coverImage ? String(book.coverImage) : null,
          }));
          setWishlistItems(formattedWishListItems);
        }
      } catch (error) {
        console.error(error);
        ToastAndroid.show(
          error instanceof Error ? error.message : "An error occurred",
          ToastAndroid.SHORT
        );
      } finally {
        setInitialLoading(false);
      }
    };

    const timer = setTimeout(fetchWishlists, 1000);
    return () => clearTimeout(timer);
  }, [favoriteToggleLoading]);

  // Render Items
  const renderItem = ({ item }: { item: WishlistItemType }) => {
    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
      </TouchableOpacity>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity
          onPress={() => handleCardPress(item.bookId)}
          style={styles.card}
          activeOpacity={0.75}
        >
          <ThemedView style={styles.cardContent}>
            {item.coverImage && (
              <Image
                source={{ uri: item.coverImage }}
                style={styles.coverImage}
              />
            )}

            <ThemedView style={styles.bookInfo}>
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              <ThemedText style={styles.author}>{item.author}</ThemedText>
            </ThemedView>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={(e) => handleMarkAsFavorite(e, item.id)}
              style={styles.actionButton}
            >
              {favoriteToggleLoading === item.id ? (
                <ActivityIndicator size={30} color={Colors.dark.primary} />
              ) : item.favorite ? (
                <Entypo name="star" size={30} color={Colors.dark.primary} />
              ) : (
                <EvilIcons
                  name="star"
                  size={30}
                  color={Colors.dark.foreground}
                />
              )}
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <ThemedScreen>
      <ThemedView>
        <ThemedText type="title">Wishlist</ThemedText>
      </ThemedView>

      {initialLoading ? (
        <ThemedView style={styles.loaderContainer}>
          <ActivityIndicator color={Colors.dark.primary} size={50} />
        </ThemedView>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.bookId}
          numColumns={1}
          ListFooterComponent={() =>
            wishlistItems.length > 0 && (
              <ThemedView style={styles.footerContainer}>
                <ThemedText style={styles.footerText}>
                  End of the List
                </ThemedText>
              </ThemedView>
            )
          }
          ListEmptyComponent={() => (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                Your wishlist is empty.
              </ThemedText>
            </ThemedView>
          )}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.container}
        />
      )}
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
    backgroundColor: Colors.dark.muted,
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
    backgroundColor: "transparent",
  },
  coverImage: {
    width: 50,
    height: 75,
    borderRadius: 5,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
    backgroundColor: "transparent",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  author: {
    fontSize: 14,
    color: Colors.dark.mutedForeground,
  },
  actionButton: {
    padding: 10,
    borderRadius: 15,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "80%",
  },
  footerContainer: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.dark.muted,
  },
  footerText: {
    color: "gray",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.dark.muted,
    borderRadius: 8,
  },
  emptyText: {
    marginTop: 15,
    color: "gray",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: "90%",
    marginLeft: 10,
    backgroundColor: "red",
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default WishListPage;
