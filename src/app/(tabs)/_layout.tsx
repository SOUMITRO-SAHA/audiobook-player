import { FloatingPlayer } from "@/components/player";
import { Colors, fontSize } from "@/constants";
import { AntDesign } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabLayout() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push({
      pathname: "player",
    });
  };

  return (
    <SafeAreaProvider
      style={{
        position: "relative",
      }}
    >
      <Tabs
        screenOptions={{
          tabBarInactiveTintColor: Colors.dark.text,
          tabBarActiveTintColor: Colors.dark.primary,
          tabBarLabelStyle: {
            fontSize: fontSize.xs,
            fontWeight: 500,
          },
          tabBarStyle: {
            position: "absolute",
            backgroundColor: Colors.dark.muted,
            bottom: 6,
            left: 6,
            right: 6,
            height: 60,
            borderTopWidth: 0,
            borderRadius: 20,
            paddingTop: 8,
            paddingBottom: 8,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              style={[
                {
                  borderRadius: 20,
                  elevation: 5,
                },
              ]}
            />
          ),
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Entypo name={"home"} color={color} size={28} />
            ),
          }}
        />
        <Tabs.Screen
          name="(wishlist)"
          options={{
            title: "Wishlist",
            tabBarIcon: ({ color }) => (
              <AntDesign name="hearto" color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="(library)"
          options={{
            title: "Library",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name={"playlist-music-outline"}
                color={color}
                size={28}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name={"account"}
                color={color}
                size={28}
              />
            ),
          }}
        />
      </Tabs>

      {/* Floating Player */}
      <FloatingPlayer onNavigate={handleNavigate} />
    </SafeAreaProvider>
  );
}
