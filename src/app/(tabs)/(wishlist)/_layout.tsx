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
    </Stack>
  );
};

export default WishListScreenLayout;
