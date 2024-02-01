import React, { useState } from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import typeOfCameraParams from './type/cameraParams';
import CameraStyle from './style/camera.style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { Button, Pressable, View, useColorScheme, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Theme from '../../theme/defaultSettings';


const Camera = ({onReadFunction, closeFunction, title}:typeOfCameraParams)=> {


    const [torch, setTorch] = useState(false);
    return (
        <View style = {{...CameraStyle.container}}>
        <QRCodeScanner

        topContent={
            <View>
                 <Button title='Vissza' onPress={()=>closeFunction()}/>
                 {title ? <Text style = {{...CameraStyle.title, color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}}>{title}</Text> : <></>}
                <Text style = {{color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color, ...CameraStyle.cameraTitle}}>QR kód beolvasása</Text>
            </View>
        }
        containerStyle = {{...CameraStyle.cameraContainerStyle}}
        flashMode={torch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topViewStyle = {{...CameraStyle.topView}}
        cameraStyle = {{...CameraStyle.camera}}
        onRead={e=>onReadFunction(e.data)}
        bottomContent={
            <View style = {{ backgroundColor : Theme.default.borderColor, borderRadius : 30 }}>
                <Pressable onPress = {()=>{setTorch(prev=>!prev)}} style = {{ backgroundColor : Theme.default.borderColor, ...CameraStyle.button }}>
                    <Text style = {{color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}}>
                    Flash light
                    </Text>
                </Pressable>
            </View>
        }

      />
      </View>
      );
}




/*
<View>
      <QRCodeScanner

        topContent={
            <View>
                <Text style = {{color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}}>Top</Text>
            </View>
        }
        containerStyle = {{...CameraStyle.cameraContainerStyle}}
        flashMode={torch ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
        topViewStyle = {{...CameraStyle.topView}}
        cameraStyle = {{...CameraStyle.camera}}
        onRead={e=>onReadFunction(e)}

        bottomContent={
            <View>
                <Pressable>
                    <Text style = {{color : useColorScheme()==="dark" ? Theme.dark.color : Theme.light.color}}>
                    Kód beírása
                    </Text>
                </Pressable>
            </View>
        }

      />
      </View>
*/
export default Camera;