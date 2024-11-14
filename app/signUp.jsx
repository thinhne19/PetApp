import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Home from '../assets/icons/Home'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import { useRouter } from 'expo-router'
import Icon from '../assets/icons'
import Image from '../assets/icons/Image'
import Button from '../components/Button'
import { TouchableOpacity } from 'react-native'


const SignUp = () => {
  const router = useRouter();
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState();

  const onSubmit = async () => {
    if (!nameRef.current || !emailRef.current || !passwordRef.current) {
      Alert.alert('Please fill all the fields!')
    }
  }


  return (

    <View style={styles.container}>
      {/*Login welcome */}
      <View>
        <Text style={styles.welcomeText}>Sign Up</Text>
      </View>

      {/*text */}

      <View style={styles.form}>
        <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>Please sign up before continue login</Text>

        <Input
          icon={<Icon name="user" size={26} strokeWidth={1.6} />}
          placeholder='Enter your name'
          onchangeText={value => { nameRef.current = value }}
        />


        <Input
          icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
          placeholder='Enter your email'
          onchangeText={value => { emailRef.current = value }}
        />


        <Input
          icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
          placeholder='Enter your password'
          onchangeText={value => { passwordRef.current = value }}
        />



        {/* button login */}
        <Button title={'Sign Up'} loading={loading} onPress={onSubmit} />\

        {/* foooter */}
        <View style = {styles.footer}>
          <Text style={styles.footerText}>
            Already have an account!
          </Text>
          <Pressable onPress={() => router.push('login')}>
            <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Login</Text>
          </Pressable>
        </View>


      </View>


    </View>
  )
}

export default SignUp

const styles = StyleSheet.create({


  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: wp(7),

  },

  welcomeText: {
    paddingTop: 100,
    fontSize: hp(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text
  },


  form: {
    gap: 25,

  },

  forgotPassword: {
    textAlign: 'right',
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },


  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  footerText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontSize: hp(1.6)
  }


})