import React, { useRef, useState, useEffect } from 'react'
import { View, Dimensions, FlatList, Image, StyleSheet, Text, TouchableHighlight } from 'react-native'
import { Video, AVPlaybackStatus } from 'expo-av';
import * as Progress from 'react-native-progress';

const { width, height } = Dimensions.get('window')


const PlayList = () => {

  let Data = [{ 
      id: 1,
      description : "Big Buck Bunny tells the story of a giant rabbit with a heart bigger than himself. When one sunny day three rodents rudely harass him, something snaps... and the rabbit ain't no bunny anymore! In the typical cartoon tradition he prepares the nasty rodents a comical revenge.\n\nLicensed under the Creative Commons Attribution license\nhttp://www.bigbuckbunny.org",
      sources : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      subtitle : "By Blender Foundation",
      thumb : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
      title : "Big Buck Bunny",
      duration: 0
    },
    { 
      id: 2,
      description : "The first Blender Open Movie from 2006",
      sources : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      subtitle : "By Blender Foundation",
      thumb : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
      title : "Elephant Dream",
      duration: 0
    },
    { 
      id: 3,
      description : "HBO GO now works with Chromecast -- the easiest way to enjoy online video on your TV. For when you want to settle into your Iron Throne to watch the latest episodes. For $35.\nLearn how to use Chromecast with HBO GO and more at google.com/chromecast.",
      sources : [ "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" ],
      subtitle : "By Google",
      thumb : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
      title : "For Bigger Blazes",
      duration: 0
    },
    { 
      id: 4,
      description : "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when Batman's escapes aren't quite big enough. For $35. Learn how to use Chromecast with Google Play Movies and more at google.com/chromecast.",
      sources : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      subtitle : "By Google",
      thumb: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg",
      title : "For Bigger Escape",
      duration: 0
    },
    { 
      id: 5,
      description : "Introducing Chromecast. The easiest way to enjoy online video and music on your TV. For $35.  Find out more at google.com/chromecast.",
      sources : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      subtitle : "By Google",
      thumb : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg",
      title : "For Bigger Fun",
      duration: 0
    },
    { 
      id: 6,
      description : "Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for the times that call for bigger joyrides. For $35. Learn how to use Chromecast with YouTube and more at google.com/chromecast.",
      sources : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      subtitle : "By Google",
      thumb: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
      title : "For Bigger Joyrides",
      duration: 0
    },
    { 
      id: 7,
      description :"Introducing Chromecast. The easiest way to enjoy online video and music on your TV—for when you want to make Buster's big meltdowns even bigger. For $35. Learn how to use Chromecast with Netflix and more at google.com/chromecast.", 
      sources : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" ,
      subtitle : "By Google",
      thumb : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerMeltdowns.jpg",
      title : "For Bigger Meltdowns",
      duration: 0
  }
]

  const video = useRef(null);

  const [currentindex, setCurrentIndex] = useState(0);

  const [videoData, setVideoData] = useState(Data);

  const [ currentVideo, setCurrentVideo ] = useState(Data[0])

  const [ duration, setDuration ] = useState(currentVideo.duration);
  const [ totalDuration, setTotalDuration ] = useState(0)

  //video.current.playAsync()



  handleVideoPress = async(item, index) => {
        if(currentVideo.duration!==1){
            currentVideo.duration = duration;
        }
        videoData.map(vid => vid.id === currentVideo.id ? currentVideo : vid)
        await video.current.pauseAsync();

        setCurrentVideo(item);
        setCurrentIndex(index);
        setTotalDuration(0);
        setDuration(item.duration);
        
        await video.current.playFromPositionAsync(item.duration)
    //console.log(item);
  }

  const renderItem = ({ item, index }) => (
      <TouchableHighlight onPress={()=> handleVideoPress(item, index)}>
            <View style={ styles.mainCardView }>
                <View style={{ flex: 0.4 }}>
                    <Image source={{ uri: item.thumb }} style={{ width: width/3, height: width/3 }} />
                </View>
                <View style={{ flex: 0.6 }}>
                    <Text>{item.title}</Text>
                    <View style={{ flexDirection:'row', justifyContent:'center', alignItems:'center' }}>
                        <View style={{ flex: 0.8 }}>
                        <Progress.Bar progress={item.id === currentVideo.id ? duration : item.duration}   />
                        </View>
                        <View style={{ flex: 0.2, justifyContent:'center', alignItems:'center' }}>
                            <Text>{item.id === currentVideo.id ? totalDuration : null}</Text>
                        </View>
                    </View>
                </View>
            </View>
    </TouchableHighlight>
  )

  const msToTime = (duration) => {
    var minutes = Math.floor(duration / 60000);
    var seconds = ((duration % 60000) / 1000).toFixed(0);
    //ES6 interpolated literals/template literals 
    //If seconds is less than 10 put a zero in front.
    return `${minutes}:${(seconds < 10 ? "0" : "")}${seconds}`;
}

  const playBackUpdate = async(status, indexs) => {

    //console.log(status, indexs)
    let duration = status.positionMillis/status.durationMillis
    setDuration(duration)
    setTotalDuration(msToTime(status.durationMillis))
    if(duration === 1){
        if(videoData.length>indexs+1){
            setCurrentIndex(indexs+1);
            setCurrentVideo(videoData[indexs+1]);
            setTotalDuration(0);
            setDuration(videoData[indexs+1].duration);
            await video.current.playFromPositionAsync(duration)
        }
        else{
            currentVideo.duration = duration;
            videoData.map(vid => vid.id === currentVideo.id ? currentVideo : vid)
            await video.current.stopAsync()
        }
    }
  }

  return (
    <View> 
      <Video
          ref={video}
          style={{ width: 400, height: 400*0.565, justifyContent:'center', alignSelf:'center', paddingTop: 100 }}
          source={{ uri: currentVideo.sources }}
          useNativeControls
          resizeMode="contain"
          onPlaybackStatusUpdate={(status) => playBackUpdate(status, currentindex)}
          shouldPlay
          progressUpdateIntervalMillis={400}
      />
      <FlatList 
          data={videoData}
          renderItem={renderItem} 
          keyExtractor={item => item.title}
          style={{ height: height- 400*0.565-80 }}
          extraData={duration}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    mainCardView: {
      height: 150,
      alignItems: 'center',
      //justifyContent: 'center',
      borderRadius: 1,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 1,
      flexDirection: 'row',
      paddingLeft: 16,
      paddingRight: 14,
      marginTop: 3,
      marginBottom: 3,
      marginLeft: 5,
      marginRight: 5,
    }
  });

export default PlayList
