import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Icon } from "@rneui/base";
import { auth, db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "userDetails"),
          where("email", "==", user.email)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUserData(doc.data());
          });
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData().then(() => setRefreshing(false));
  }, []);

  const getInitials = () => {
    const { firstName, lastName } = userData;
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "";
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        Alert.alert("Logout", "You have been logged out.");
        navigation.replace("Login");
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { userData });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.firstContainer}>
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{getInitials()}</Text>
        </View>
        <Text style={styles.fullName}>
          {userData.firstName} {userData.lastName}
        </Text>
        <TouchableOpacity
          style={styles.profile_btn}
          onPress={handleEditProfile}
        >
          <Text style={styles.btnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.secondContainer}>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.icon_text}>
            <Icon
              type="ionicon"
              name="cog-outline"
              size={28}
              style={styles.icon}
            />
            <Text style={styles.iconText}>Settings</Text>
            <Icon type="ionicon" size={20} name="chevron-forward-outline" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon_text}>
            <Icon
              type="ionicon"
              name="book-outline"
              size={28}
              style={styles.icon}
            />
            <Text style={styles.iconText}>Feedback</Text>
            <Icon type="ionicon" size={20} name="chevron-forward-outline" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon_text} onPress={handleLogout}>
            <Icon
              type="ionicon"
              name="log-out-outline"
              size={28}
              style={styles.icon}
              color={"red"}
            />
            <Text
              style={{
                fontSize: height * 0.021,
                fontWeight: "600",
                flex: 1,
                marginLeft: width * 0.03,
                color: "red",
              }}
            >
              Logout
            </Text>
            <Icon
              type="ionicon"
              size={20}
              name="chevron-forward-outline"
              color={"red"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dddddd",
  },
  firstContainer: {
    flex: 10,
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  secondContainer: {
    flex: 7,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    paddingVertical: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  initialsContainer: {
    height: height * 0.2,
    width: height * 0.2,
    backgroundColor: "#4361ee",
    borderRadius: height * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "#ffffff",
    fontSize: height * 0.08,
    fontWeight: "700",
  },
  fullName: {
    paddingTop: height * 0.02,
    fontSize: height * 0.03,
    fontWeight: "700",
  },
  profile_btn: {
    marginTop: height * 0.03,
    paddingHorizontal: width * 0.07,
    paddingVertical: height * 0.02,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4361ee",
  },
  btnText: {
    fontSize: height * 0.017,
    fontWeight: "600",
  },
  icon: {
    padding: width * 0.03,
    backgroundColor: "#eeeeee",
    borderRadius: 12,
  },
  iconText: {
    fontSize: height * 0.021,
    fontWeight: "600",
    flex: 1,
    marginLeft: width * 0.03,
  },
  icon_text: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  optionsContainer: {
    width: "100%",
  },
});
