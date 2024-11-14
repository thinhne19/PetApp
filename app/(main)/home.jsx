import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useRouter } from 'expo-router'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import Icon from '../../assets/icons'
import { useUser } from '@clerk/clerk-expo'
import Slider from '../../components/Home/Slider'
import Header from '../../components/Home/Header'
import Category from '../../components/Home/Category'
import FoodByCategory from '../../components/Home/FoodByCategory'

const Home = () => {

    const router = useRouter();
    const {user} = useUser();

  return (

    <View style = {{padding : 20, marginTop: 20}}> 
      {/*Header*/}
        <Header/>
      {/*Slider*/} 
        <Slider />
      {/*Pet's Food*/}
      <Category/>
      {/*List Food*/}

      </View>

  )
}

export default Home

const styles = StyleSheet.create({


})