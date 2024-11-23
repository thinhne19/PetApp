import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Image, Text, View, TouchableOpacity, Button, Pressable, Alert } from 'react-native'
import { theme } from '../../constants/theme'
import { hp, wp } from '../../helpers/common'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useUser } from '@clerk/clerk-expo'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import RichTextBox from '../../components/RichTextPost'
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av'
const NewPost = () => {
  const { user } = useUser();
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(file);

  const onPick = async (isImage) => {
    let mediaConfig = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    }
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig)

    console.log('file : ', result.assets[0])
    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  }

  const onSubmit = async () => {
    if(!bodyRef.current && !file)
    {
      Alert.alert('Post', "Please choose an image or add post")
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId : user?.id
    }
    //create post
  }

  const isLocalFile = file => {
    if(!file) return null;
    if(typeof file =='object') return true;

    return false;
  }

  const getFileType = file => {
    if(!file) return null;
    if(isLocalFile(file)) {
      return file.type;
    }

    //check image or video for remote file
    if(file.includes('postImage')) {
      return 'image';
    }
    return 'video';
  }


  const getFileUri = file => {
    if(!file) return null;
    if(isLocalFile(file)) {
      return file.uri;
    }
  }
  return (
    <ScreenWrapper bg="#FFFFFF">
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Nội dung post */}
        <View style={styles.createPostContainer}>
          <Text style={styles.createPostText}>Create Post</Text>
        </View>

        {/* Header Profile */}
        <View style={styles.userInfoContainer}>
          {/* Avatar */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user?.imageUrl }}
              style={styles.avatar}
            />
          </View>

          {/* Thông tin người dùng */}
          <View style={styles.name}>
            <Text style={styles.name}>
              {user?.lastName}
            </Text>
          </View>
        </View>
        <View>
          <RichTextBox editorRef={editorRef} onChange={body => bodyRef.current = body} />
        </View>

        {
          file && (
            <View style = {styles.file}>
              {
                getFileType(file) == 'video'? (
                  <Video
                    style = {{flex: 1}}
                    source={{uri:getFileUri(file)}}
                    useNativeControls
                    resizeMode='cover'
                    isLooping
                  />
                ) : (
                  <Image source={{uri: getFileUri(file) }} resizeMode='cover' style = {{flex: 1}}/>
                )
              }

              <Pressable style={styles.delete} onPress={() => setFile(null)}>
              <Ionicons name="trash-outline" size={24} color="black" />
              </Pressable>

            </View>
          )
        }

        <View style={styles.media}>
          <Text style={styles.addImageText}>Add to your post</Text>
          <View style={styles.mediaIcons}>
            <TouchableOpacity onPress={() => onPick(true)}>
              <Ionicons name="images-outline" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onPick(false)}>
              <Ionicons name="videocam-outline" size={28} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={onSubmit}
        loading={loading}
        hasShowdow={false}
        style={[
          styles.postButton,
          styles.disabledButton
        ]}
      >
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>Post</Text>
          </View>
      </TouchableOpacity>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  createPostContainer: {
    backgroundColor: 'white',
    padding: 16,
  },
  createPostText: {
    color: '#FF9900',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center'
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginLeft: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF8533',
    marginBottom: 20,
    textAlign: 'center',
  },
  media: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    borderColor: theme.colors.gray
  },
  mediaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  postButton: {
    height: hp(6.2),
    backgroundColor: '#FFCC66', // Màu xanh dịu
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  file: {
    height: hp(30),
    width: '100%',
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderCurve: 'continuous',
    padding : 15
  },
  delete: {
    position: 'absolute',
    top: 9,
    right: 9,
    padding: 5,
    borderRadius: 50,
    backgroundColor: '#FF9900'
  }
})