import { Stack } from "expo-router";
import React from "react";

const WishListScreenLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[slug]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="wishlist"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default WishListScreenLayout;
