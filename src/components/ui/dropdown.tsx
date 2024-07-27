import { Colors } from "@/constants";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet } from "react-native";
import ReactSelectDropdown from "react-native-select-dropdown";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface SelectDropdownProps {
  data: { title: string; icon?: string }[];
  placeholder?: string;
  state: string;
  setState: (value: string) => void;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  data,
  placeholder,
  state,
  setState,
  ...props
}) => {
  return (
    <>
      <ReactSelectDropdown
        data={data}
        defaultValue={state}
        onSelect={(selectedItem, index) => {
          setState(selectedItem);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <ThemedView style={styles.dropdownButtonStyle}>
              {selectedItem && (
                <MaterialIcons
                  name={selectedItem.icon}
                  style={styles.dropdownButtonIconStyle}
                />
              )}
              <ThemedText style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.title) ||
                  placeholder ||
                  "Select your mood"}
              </ThemedText>
              <MaterialCommunityIcons
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </ThemedView>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <ThemedView
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#D2D9DF" }),
              }}
            >
              <MaterialIcons
                name={item.icon}
                style={styles.dropdownItemIconStyle}
              />
              <ThemedText style={styles.dropdownItemTxtStyle}>
                {item.title}
              </ThemedText>
            </ThemedView>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.dark.foreground,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
