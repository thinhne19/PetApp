import { View, Text } from 'react-native'
import React from 'react'
import Category from './Category'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/config'


export default function FoodByCategory() {

    const GetFood = async(category) => {
        const q = query(collection(db, 'Foods'),where('category', '==', category?category:'Dogs'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            console.log(doc.data());
        })
    }

  return (
    <View>
      <Category category={(value)=>GetFood(value)}/>
    </View>
  )
}

