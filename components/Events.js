import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Icon } from "@rneui/base";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { formatDistanceToNow } from "date-fns";

const { width, height } = Dimensions.get("window");

const Events = () => {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(collection(db, "events"));
      setEvents(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate(),
        }))
      );
    } catch (error) {}
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  return (
    <View style={styles.event}>
      <Text style={styles.head}>Events</Text>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
          />
        }
      >
        {events.map((event) => (
          <View key={event.id} style={styles.eventContainer}>
            <View style={styles.body}>
              <Icon
                type="ionicon"
                name="chevron-forward"
                size={16}
                color="#003D94"
              />
              <Text style={styles.text}>{event.name}</Text>
            </View>
            {event.date && (
              <Text style={styles.timeText}>
                {formatDistanceToNow(event.date, { addSuffix: true })}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  event: {
    width: "100%",
    height: height * 0.2,
    padding: width * 0.02,
    borderRadius: 12,
    borderColor: "#CFF393",
    borderWidth: 1,
  },
  head: { fontSize: 16, color: "#FFF" },
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 4,
    padding: width * 0.015,
    marginBottom: 4,
  },
  body: { flexDirection: "row", alignItems: "center" },
  text: { fontSize: 14, color: "#1F2937", marginLeft: width * 0.015 },
  timeText: { fontSize: 10, color: "#6B7280" },
});
