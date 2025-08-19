import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Icon } from "@rneui/base";

const Filter = () => {
  return (
    <View style={styles.Container}>
      <Icon type="ionicon" name="filter" size={20} color="#3c3d42" />
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: "#e0ddca",
    height: 40,
    width: 40,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 5,
    marginLeft: 15,
  },
});
