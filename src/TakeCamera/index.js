import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

function CameraScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [loading, setLoading] = useState(false);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const cameraRef = useRef(null)

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');

            let res = await Location.requestPermissionsAsync();
            if (res?.status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <TouchableOpacity
            onPress={() => {
                navigation.goBack()
            }}><Text>No access to camera</Text></TouchableOpacity>;
    }


    return (
        <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#48C1F6' }}>
            <Text style={{ fontSize: 20, color: 'white', marginHorizontal: 20, textAlign: 'center', marginTop: 10 }}>Take a picture of the sky to check the weather forecast!</Text>
            <View style={{ flex: 1, width: '90%', marginVertical: 20, marginHorizontal: 20, borderRadius: 20, overflow: 'hidden' }}>
                <Camera ref={cameraRef} style={{ flex: 1 }} type={type}>
                </Camera>
            </View>
            <TouchableOpacity
                onPress={() => {
                    cameraRef?.current.pausePreview()
                    setLoading(true)
                    setTimeout(async() => {
                        if (location?.coords) {
                            const { latitude, longitude } = location?.coords
                            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=500a69839bef56164f64f1829c8b11a0&units=metric`)
                                .then(response => response.json())
                                .then(data => {
                                    setLoading(false)
                                    cameraRef?.current.resumePreview()
                                    navigation.navigate('Weather', { data })
                                })
                                .catch(error => {
                                    setLoading(false)
                                });
                        } else {
                            let res = await Location.requestPermissionsAsync();
                            if (res?.status !== 'granted') {
                                setErrorMsg('Permission to access location was denied');
                                setLoading(false)
                                return;
                            }

                            let new_location = await Location.getCurrentPositionAsync({});
                            if (new_location?.coords) {
                                const { latitude, longitude } = new_location?.coords
                                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=500a69839bef56164f64f1829c8b11a0&units=metric`)
                                    .then(response => response.json())
                                    .then(data => {
                                        setLoading(false)
                                        cameraRef?.current.resumePreview()
                                        navigation.navigate('Weather', { data })
                                    })
                                    .catch(error => {
                                        setLoading(false)
                                    });
                            } else alert('Location failed!')
                        }
                    }, 5000)
                }}>
                <View style={{
                    width: 60,
                    height: 60,
                    backgroundColor: '#DC7D7B',
                    borderRadius: 200,
                    borderWidth: 5,
                    borderColor: 'white'
                }} />
            </TouchableOpacity>
            <Spinner
                visible={loading}
            />
        </View>
    );
}
export default CameraScreen;