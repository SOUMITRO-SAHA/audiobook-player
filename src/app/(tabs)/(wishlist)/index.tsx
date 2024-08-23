import { ThemedScreen } from "@/components";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBox } from "@/components/ui";
import { TrendingSection, WishListFlatlist } from "@/components/wishlist";
import { Colors } from "@/constants";
import { useAppContext } from "@/context/AppContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import * as React from "react";

interface SearchScreenProps {
  //Props
}

const SearchScreen: React.FC<SearchScreenProps> = (props) => {
  const [search, setSearch] = React.useState("");

  // Getting the Books Info
  const { trendingBooks, searchedBooks, searchBooks } = useAppContext();

  // Side Effects

  return (
    <ThemedScreen>
      <ThemedView className="flex flex-row items-center justify-between space-x-5">
        <ThemedText type="title">Books</ThemedText>
        <ThemedView className="rounded-full">
          <Link href={"/wishlist"}>
            <MaterialIcons
              name="playlist-add-check"
              size={28}
              color={Colors.dark.foreground}
            />
          </Link>
        </ThemedView>
      </ThemedView>

      {/* Search Box */}
      <SearchBox
        text={search}
        onChangeText={(value) => {
          setSearch(value);
        }}
        onSearch={(searchText) => {
          searchBooks(searchText);
        }}
      />

      {/* Trending List */}
      {trendingBooks && trendingBooks.length > 0 && (
        <TrendingSection books={trendingBooks} />
      )}

      {/* List Items */}
      <WishListFlatlist data={searchedBooks} />
    </ThemedScreen>
  );
};

export default SearchScreen;
