import {useEffect, useState} from 'react';
import typeOfReadQrCodeParams from './types/readQrCodeParams';
import Camera from '../camera/camera.component';
import postData from '../../request/post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PopUpWindow from '../popUpWindow/popUpWindow.component';
import {View, Text, Touchable, Pressable, useColorScheme} from 'react-native';
import {Button} from 'react-native-ui-lib';
import Response from './response.component';
import ReadQrCodeStyle from './style/readQrCodeStyle';
import Theme from '../../theme/defaultSettings';
import Loader from '../loader/loader.component';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const ReadQrCode = ({id, backFunction}: typeOfReadQrCodeParams) => {
  const [opened, setOpened] = useState<boolean>(false);
  const [eventResponse, setEventResponse] = useState<any>();
  const [cameraUsage, setCameraUsage] = useState(true);
  const handleQrCodeReading = async (data: string) => {
    postData(`ticket-validation/${data}`, {
      eventId: id,
      token: await AsyncStorage.getItem('token'),
    }).then(response => {
      setEventResponse(response);
    });
    setOpened(true);
  };

  console.log("opened", opened);
  console.log("eventResponse", eventResponse);


  return (
    <View>
      <PopUpWindow closeFunction={() => setOpened(false)} isVisible={opened}>
        <View>
          {eventResponse ? (
            <Response
              description={
                <View>
                  {eventResponse.seatName ? <Text
                    style={{
                      ...ReadQrCodeStyle.description,
                      fontFamily: Theme.default.fontFamily,
                      color:
                        useColorScheme() === 'dark'
                          ? Theme.dark.color
                          : Theme.light.color,
                    }}>
                    {eventResponse.seatName}
                  </Text> : <></>}
                </View>
              }
              type={
                eventResponse
                  ? eventResponse.error
                    ? 'error'
                    : eventResponse.type
                  : 'error'
              }
              title={
                eventResponse
                  ? eventResponse.message
                    ? eventResponse.message
                    : ''
                  : ''
              }
            />
          ) : (
            <Loader />
          )}
        </View>
      </PopUpWindow>
      {opened ? (
        <></>
      ) : (
        cameraUsage ? 
        <Camera
          closeFunction={backFunction}
          onReadFunction={handleQrCodeReading}
        />
       : <text>Camera doesnt allowed</text>)}
    </View>
  );
};

export default ReadQrCode;
