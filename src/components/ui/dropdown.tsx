import { Colors } from "@/constants";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet } from "react-native";
import ReactSelectDropdown from "react-native-select-dropdown";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface DropdownItem {
  value: string;
  label: string;
  icon?: string;
}

interface SelectDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  state: DropdownItem;
  setState: (value: string) => void;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  data,
  placeholder,
  state,
  setState,
  ...props
}) => {
  // Find the currently selected item to display in the dropdown button
  const selectedItem = data.find((item) => item.value === state.value);

  return (
    <ReactSelectDropdown
      data={data}
      defaultValue={selectedItem}
      onSelect={(selectedItem) => {
        setState(selectedItem.value);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <ThemedView style={styles.dropdownButtonStyle}>
            {selectedItem?.icon && (
              <MaterialIcons
                name={selectedItem.icon}
                style={styles.dropdownButtonIconStyle}
              />
            )}
            <ThemedText style={styles.dropdownButtonTxtStyle}>
              {selectedItem?.label || placeholder || "Select an option"}
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
            style={[
              styles.dropdownItemStyle,
              isSelected && { backgroundColor: "#D2D9DF" },
            ]}
          >
            {item.icon && (
              <MaterialIcons
                name={item.icon}
                style={styles.dropdownItemIconStyle}
              />
            )}
            <ThemedText style={styles.dropdownItemTxtStyle}>
              {item.label}
            </ThemedText>
          </ThemedView>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
      {...props}
    />
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
