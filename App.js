import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon } from "@rneui/base";

import HomeScreen from "./screens/HomeScreen";
import Navigate from "./screens/Navigate";
import DestinationScreen from "./screens/DestinationScreen";
import PhotoGalleryScreen from "./screens/PhotoGalleryScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import CabScreen from "./screens/CabScreen";
import Pp from "./screens/pp";
import CabDetails from "./screens/CabDetails";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignupScreen";
import EditProfile from "./screens/EditProfile";

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#4361ee",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarInactiveTintColor: "#dddddd",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon type="ionicon" name="home" color={color} size={23} />
          ),
        }}
      />
      <Tab.Screen
        name="Navigate"
        component={Navigate}
        options={{
          tabBarInactiveTintColor: "#dddddd",
          tabBarLabel: "Navigate",
          tabBarIcon: ({ color, size }) => (
            <Icon type="ionicon" name="map-outline" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={PhotoGalleryScreen}
        options={{
          tabBarInactiveTintColor: "#dddddd",
          tabBarLabel: "Gallery",
          tabBarIcon: ({ color, size }) => (
            <Icon
              type="ionicon"
              name="images-outline"
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarInactiveTintColor: "#dddddd",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon
              type="ionicon"
              name="person-circle-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const MainStackScreen = () => (
  <MainStack.Navigator>
    <MainStack.Screen
      name="Onboarding"
      component={OnboardingScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="EditProfile"
      component={EditProfile}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="Main"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="CabScreen"
      component={CabScreen}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="PopularPlaces"
      component={Pp}
      options={{ headerShown: true }}
    />
  </MainStack.Navigator>
);

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ presentation: "modal" }}>
          <RootStack.Screen
            name="MainStack"
            component={MainStackScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="CabDetails"
            component={CabDetails}
            options={{
              headerShown: false,
              cardStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            }}
          />
          <RootStack.Screen
            name="Destination"
            component={DestinationScreen}
            options={{
              headerShown: false,
              cardStyle: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
