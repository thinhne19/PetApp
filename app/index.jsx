import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Redirect, useRootNavigationState, useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { useUser } from '@clerk/clerk-expo';


const Index = () => {
  const router = useRouter();
  const {user} = useUser();
  
  return (
    <ScreenWrapper>
      {user? <Redirect href = {'/(main)/home'}/>
      : <Redirect href = {'/welcome'}/>
      }
    </ScreenWrapper>
  );
};

export default Index;