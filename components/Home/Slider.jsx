import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from   
 '../../config/config'; // Assuming `db` is your Firebase Firestore instance

const Slider = () => {

  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    const GetSliders = async () => {
      try {
        setSliderList([]);
        const Snapshot = await getDocs(collection(db, 'Sliders'));
        Snapshot.forEach((doc) => {
          setSliderList((sliderList) => [...sliderList, doc.data()]);
        });
      } catch (error) {
        console.error('Error fetching sliders:', error);
      }
    };

    GetSliders();
  }, []); // Empty dependency array to run `GetSliders` only once

  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        data={sliderList}
        horizontal // Set horizontal scrolling for the slider
        showsHorizontalScrollIndicator={false} // Hide the scroll indicator
        keyExtractor={(item) => item.id || Math.random().toString()} // Unique key for each item
        renderItem={({ item }) => (
          <View style={styles.sliderItem}>
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.sliderImage}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  sliderItem: {
    width: Dimensions.get('screen').width * 0.9, // Adjust width as needed
    marginRight: 15, // Margin between slides
  },
  sliderImage: {
    width: '100%', // Set width to 100% for full width within the slider item
    height: 180,
    borderRadius: 15,
  },
});