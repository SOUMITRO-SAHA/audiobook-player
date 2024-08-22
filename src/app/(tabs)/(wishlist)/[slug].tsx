import {
  ThemedButton,
  ThemedScreen,
  ThemedText,
  ThemedView,
} from "@/components";
import { FastImageComponent } from "@/components/image";
import { Colors } from "@/constants";
import { useAppContext } from "@/context/AppContext";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";
import { cn, sleep } from "@/lib/utils";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, StyleSheet, ToastAndroid } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const BookInfoScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const [alreadyInWishList, setAlreadyInWishList] =
    React.useState<boolean>(false);

  const { getBookById } = useAppContext();
  const { id } = useLocalSearchParams();

  const book = React.useMemo(() => {
    if (id) return getBookById(id as string);
  }, [id]);

  if (!book) return null;

  const router = useRouter();

  const handleAddToWishlist = async () => {
    setLoading(true);
    try {
      // First check whether the book is already in the wishlist or not
      const existingBook = await db.query.wishlist.findFirst({
        where: eq(wishlist.bookId, book.id),
      });

      if (existingBook) {
        setAlreadyInWishList(true);
        ToastAndroid.show(
          "This book is already in your wishlist",
          ToastAndroid.SHORT
        );
        return;
      } else {
        const authorsStr = book.authors?.join(",");

        await db.insert(wishlist).values({
          bookId: book.id,
          title: book.title,
          author: authorsStr,
          coverImage: book.coverImage,
        });

        ToastAndroid.show("Book added to your wishlist", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      }
    } finally {
      sleep(1000);
      setLoading(false);
    }
  };

  const goToWishlistScreen = () => {
    router.push("/(wishlist)/wishlist");
  };

  React.useEffect(() => {
    const checkIsInWishlist = async () => {
      try {
        // First check whether the book is already in the wishlist or not
        const existingBook = await db.query.wishlist.findFirst({
          where: eq(wishlist.bookId, book.id),
        });

        if (existingBook) {
          setAlreadyInWishList(true);
          return;
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          ToastAndroid.show(error.message, ToastAndroid.SHORT);
        }
      }
    };

    const tx = setTimeout(checkIsInWishlist, 1000);
    return () => clearTimeout(tx);
  }, []);

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
          <FastImageComponent
            source={{
              uri: book?.coverImage || "https://via.placeholder.com/150",
            }}
            style={styles.coverImage}
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
            onPress={
              alreadyInWishList ? goToWishlistScreen : handleAddToWishlist
            }
            style={styles.wishlistButton}
            variant="default"
            size="full"
          >
            {loading ? (
              <ActivityIndicator color={Colors.dark.primary} size={50} />
            ) : alreadyInWishList ? (
              <>
                <ThemedText>This book is already on your wishlist</ThemedText>
              </>
            ) : (
              <>
                <FontAwesome6
                  name="add"
                  size={24}
                  color={Colors.dark.foreground}
                />
                <ThemedText style={styles.wishlistButtonText}>
                  Add to Wishlist
                </ThemedText>
              </>
            )}
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
    // width: 150,
    height: 250,
    // borderRadius: 8,
    marginBottom: 18,
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
