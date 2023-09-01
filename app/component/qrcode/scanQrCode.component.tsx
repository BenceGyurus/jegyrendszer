import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
// @ts-ignore
import ViewPropTypes from 'deprecated-react-native-prop-types';
import { Button, Image } from 'react-native-ui-lib';
import BasicStyle from '../../defaultStyles/style';
import postData from '../../requests/post';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons/faTriangleExclamation';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';

type typeOfQrCodeScannerAppParams = {
  closeFunction : Function,
  eventId : string,
  eventName : string,
  eventImage : string,
  basicUrl : string,
  isDark? : boolean,
  token : string
}

const QRCodeScannerApp = ({ closeFunction, eventId, eventName, eventImage, basicUrl, isDark, token }: typeOfQrCodeScannerAppParams) => {

  const [torch, setTorch] = useState(false);
  const [qrCode, setQrCode]: [any, Function] = useState(false);
  const animationValue = useState(new Animated.Value(0))[0];

  const validQrCode = (data: string) => {
    if (token) {
      postData(`${basicUrl}/ticket-validation/${data}`, { token: token, eventId: eventId })
        .then(async (response) => {
          console.log(response)
          if (response.responseData){
            response = await response.responseData;
          }
          setQrCode(response);
          // Animating the component to slide in from the bottom
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();
        });
    }
  }

  const handleHideMessage = () => {
    // Hiding the component by sliding it out
    Animated.timing(animationValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setQrCode(false);
    });
  };

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height, Dimensions.get("window").height / 2],
  });

  const getMessageStyle = (type:string):any => {
    switch (type) {
      case "error":
        return styles.errorMessage;
      case "warn":
        return styles.warnMessage;
      case "success":
        return styles.successMessage;
      default:
        return styles.defaultMessage;
    }
  };

  const getMessageIcon = (type:string) => {
    switch (type) {
      case "error":
        return faTimesCircle;
      case "warn":
        return faTriangleExclamation;
      case "success":
        return faCheckCircle;
      default:
        return faInfoCircle;
    }
  };

  return (
    <View>
      {!qrCode ? (
        <QRCodeScanner
          onRead={e => {
            validQrCode(e.data);
          }}
          flashMode={torch ? RNCamera.Constants.FlashMode.torch : false}
          cameraStyle={{ height: Dimensions.get("window").height }}
        />
      ) : (
        <TouchableWithoutFeedback onPress={handleHideMessage}>
          <Animated.View
            style={[
              styles.messageContainer,
              { backgroundColor: isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor, transform: [{ translateY }] },
            ]}
          >
            <View style = {{width : "60%", left : "20%", flex : 1}}><FontAwesomeIcon icon={getMessageIcon(qrCode.type)} color={getMessageStyle(qrCode.type).color} size={Dimensions.get("window").width*0.6} /></View>
            <Text style={[styles.messageText, getMessageStyle(qrCode.type)]}>{qrCode.message}</Text>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {!qrCode ? <Button label={"Light"} onPress={() => { setTorch(!torch) }} style={{ position: "absolute", top: Dimensions.get("window").height - 100, width: "30%", left: "35%" }} /> : ""}
      <TouchableOpacity onPress={e=>closeFunction()}>
        <View style = {{width : "95%", height : Dimensions.get("window").height*0.2, backgroundColor : isDark ? BasicStyle.dark.backgroundColor : BasicStyle.light.backgroundColor, borderRadius : 20, marginTop : 10, left : "2.5%"}}>
          <View>
            <Image source = {{uri : `${basicUrl}${eventImage}`}} style = {{width : 70, height : 70, position : "absolute", top : 20, left : 15, borderRadius : 10}} />
            <Text style = {{position : "absolute", left : 100, top : 30, width : Dimensions.get("window").width-110}}>{eventName}</Text>
        </View>
      </View>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    width: "100%",
    height: Dimensions.get("window").height / 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  messageText: {
    position : "absolute",
    fontSize: 23,
    width : "70%", 
    top : "100%",
    left : "23%",
    textAlign : "center",
    fontWeight : "bold"
  },
  errorMessage: {
    color: 'red',
  },
  warnMessage: {
    color: 'orange',
  },
  successMessage: {
    color: 'green',
  },
  defaultMessage: {},
});



export default QRCodeScannerApp;

/*
*/