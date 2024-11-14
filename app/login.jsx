import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Home from '../assets/icons/Home'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import { useRouter } from 'expo-router'
import Icon from '../assets/icons'
import Button from '../components/Button'
import { TouchableOpacity } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { useAuth, useOAuth, useUser } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Image } from 'react-native-svg'




export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()



const Login = () => {
  const router = useRouter();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState();

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert('Please fill in your email and password')
    }
  }


  useWarmUpBrowser()

  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(main)/home', { scheme: 'myapp' }),
      })

      if (createdSessionId) {

      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, []);

  const {user} = useUser();
  const { isSignedIn } = useAuth();
  console.log(user);

  useEffect(() => {
    if (isSignedIn) {
      router.push('/(main)/');
    }
  }, [isSignedIn]);


  return (

    <View style={styles.container}>
      {/*Login welcome */}
      <View>
        <Text style={styles.welcomeText}>Login</Text>
      </View>

      {/*text */}

      <View style={styles.form}>
        <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>Please sign in to continue</Text>

        <Input
          icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
          placeholder='Enter your email'
          onchangeText={value => { emailRef.current = value }}
        />

        <Input
          icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
          placeholder='Enter your password'
          secureTextEntry
          onchangeText={value => { passwordRef.current = value }}
        />

        <Text style={styles.forgotPassword}>
          Forgot Password?
        </Text>




        {/* button login */}
        <Button title={'Login'} loading={loading} onPress={() => router.push('home')} /> 



        <View style={{flexDirection : "row", alignItems : "center", marginVertical: 20, }}>
          <View
            style = {{
              flex : 1,
              height : 1,
              backgroundColor : theme.colors.gray,
              marginHorizontal : 10
            }}
          />
          <Text style = {{fontSize : 14, }}>Or sign up with</Text>
          <View
            style = {{
              flex : 1,
              height : 1,
              backgroundColor : theme.colors.gray,
              marginHorizontal : 10
            }}
          />
        </View>



        <View style ={{flexDirection : 'row', justifyContent : 'center'}}>
          <TouchableOpacity onPress={onPress}
            style = {{
              flex : 1,
              alignItems : "center",
              justifyContent : "center",
              flexDirection : 'row',
              height: 52,
              borderWidth : 1,
              borderColor : theme.colors.grey,
              marginRight : 4,
              borderRadius : 10,  
            }}
          >
              <Image source = {require('../assets/images/google.png')}
                style = {{height: 30, width: 30, marginRight : 8}}
                resizeMode = 'container'
              
              />
              <Text>Google</Text>
          </TouchableOpacity>

        </View>



        {/* foooter */}
        <View style = {styles.footer}>
          <Text style={styles.footerText}>
            Do not have an account!
          </Text>
          <Pressable onPress={() => router.push('signUp')}>
            <Text style={[styles.footerText, { color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold }]}>Sign Up?</Text>
          </Pressable>
        </View>


      


      </View>


    </View>
  )
}

export default Login

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