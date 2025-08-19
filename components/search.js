import { StyleSheet, TextInput, View, Dimensions } from "react-native";
import React from "react";
import { Icon } from "@rneui/base";

const { width, height } = Dimensions.get("window");

const Search = ({ placeholder, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Icon type="ionicon" name="search" size={height * 0.03} color="#000000" />
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height * 0.06,
    // marginTop: height * 0.06,
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
  },
  textInput: {
    width: width * 0.7,
    height: height * 0.04,
    marginLeft: width * 0.03,
  },
});
