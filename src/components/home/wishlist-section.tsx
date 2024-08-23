import { wishlist } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { FastImageComponent } from "../image";
import { Colors } from "@/constants";

interface WishListSectionProps {
  data: InferSelectModel<typeof wishlist>[];
}

export const WishListSection: React.FC<WishListSectionProps> = ({ data }) => {
  const renderWishListCard = ({
    item,
  }: {
    item: InferSelectModel<typeof wishlist>;
  }) => (
    <View style={styles.card}>
      <FastImageComponent
        source={{ uri: item.coverImage }}
        style={styles.coverImage}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderWishListCard}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {},
  card: {
    width: 120,
    marginRight: 10,
    alignItems: "center",
  },
  coverImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.dark.text,
  },
  author: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
});
