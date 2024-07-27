import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SearchBox } from "@/components/ui";
import * as React from "react";

interface SearchScreenProps {
  //Props
}

const SearchScreen: React.FC<SearchScreenProps> = (props) => {
  const [search, setSearch] = React.useState("");

  return (
    <ParallaxScrollView>
      <ThemedView>
        <ThemedText type="title">Search</ThemedText>
      </ThemedView>

      {/* Search Box */}
      <SearchBox text={search} onChangeText={setSearch} />
    </ParallaxScrollView>
  );
};

export default SearchScreen;
