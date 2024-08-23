import { timestamp, track } from "@/lib/db/schema";
import { eq, InferSelectModel } from "drizzle-orm";
import * as React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { FastImageComponent } from "../image";
import { db } from "@/lib/db";
import { extractName } from "@/lib/utils";
import { ThemedButton } from "../ThemedButton";
import { ThemedText } from "../ThemedText";

type HistorySectionProps = {
  tracks: InferSelectModel<typeof track>[] | undefined | null;
};

export const HistorySection = ({ tracks }: HistorySectionProps) => {
  const [progress, setProgress] = React.useState<
    InferSelectModel<typeof timestamp>[] | null
  >();

  // Side Effects
  React.useEffect(() => {
    if (tracks && tracks.length > 0) {
      const getProgressOfAllTracks = async () => {
        const timestampPromise = await Promise.all(
          tracks.map(async (track) => {
            return await db.query.timestamp.findFirst({
              where: eq(timestamp.trackUrl, track.url),
            });
          })
        );

        // Filter out undefined values
        const validProgress = timestampPromise.filter(
          (item): item is InferSelectModel<typeof timestamp> =>
            item !== undefined
        );

        if (validProgress.length > 0) {
          setProgress(validProgress);
        }
      };

      const timeId = setTimeout(getProgressOfAllTracks, 1000);

      return () => clearTimeout(timeId);
    }
  }, [tracks]);

  const renderTrackCard = ({
    item,
  }: {
    item: InferSelectModel<typeof track>;
  }) => {
    const thisTrackProgress = progress?.find((t) => t.trackUrl === item.url);

    let percentage;

    if (thisTrackProgress) {
      percentage = (
        Number(thisTrackProgress?.timestamp) / Number(item.duration)
      ).toFixed(2);
    }

    return (
      <View style={styles.card} className="relative">
        {/* Percentage */}
        {percentage && (
          <ThemedButton
            size="sm"
            className="absolute z-50 p-1 px-[5px] top-1 right-1 bg-green-400"
            onPress={() => {}}
          >
            <ThemedText className="text-xs">{percentage} %</ThemedText>
          </ThemedButton>
        )}
        <FastImageComponent
          source={{ uri: item.artwork as string }}
          style={styles.artwork}
        />
        <Text style={styles.title}>
          {extractName(item.title, [String(item.artist)]) || "Unknown Title"}
        </Text>
        <Text style={styles.artist}>{item.artist || "Unknown Artist"}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={tracks}
      renderItem={renderTrackCard}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  card: {
    marginRight: 15,
    width: 150,
    backgroundColor: "#1f2937",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
  },
  artwork: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#e2e8f0",
  },
  artist: {
    textAlign: "center",
    marginTop: 5,
    fontSize: 14,
    color: "#a1a1aa",
  },
});
