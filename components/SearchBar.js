import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { Icon } from "@rneui/base";

const { width, height } = Dimensions.get("window");

const SearchBar = ({ placeholder, query, onChangeText, data, onSelect }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setShowSuggestions(false);
  };

  return (
    <View style={styles.container}>
      <Icon type="ionicon" name="search" size={height * 0.03} color="#000000" />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        value={query}
        onChangeText={(text) => {
          onChangeText(text);
          setShowSuggestions(true);
        }}
      />
      {showSuggestions && data.length > 0 && (
        <FlatList
          style={styles.suggestionsContainer}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelect(item)}
            >
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height * 0.06,
    marginTop: height * 0.06,
    backgroundColor: "#eeeeee",
    padding: height * 0.012,
    paddingLeft: width * 0.03,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 5,
    position: "relative",
    zIndex: 1,
  },
  textInput: {
    width: width * 0.7,
    height: height * 0.04,
    marginLeft: width * 0.03,
  },
  suggestionsContainer: {
    position: "absolute",
    top: height * 0.06,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 5,
    maxHeight: height * 0.3,
  },
  suggestionItem: {
    padding: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
