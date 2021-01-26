import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';

function HomeScreen({ navigation }) {
    useEffect(() => {
        (async () => {

            let res = await Location.requestPermissionsAsync();
            if (res?.status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
        })();
    }, []);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#48C1F6', paddingBottom: 30 }}>
            <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <Icon name="camera" size={40} color="black" style={{ marginHorizontal: 10 }} />
                <Icon name="plus" size={40} color="black" style={{ marginHorizontal: 10 }} />
                <Icon name="cloud" size={40} color="black" style={{ marginHorizontal: 10 }} />
            </View>
            <TouchableOpacity onPress={() => { navigation.navigate('Camera') }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="sign-in" size={50} color="black" />
                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>ENTER</Text>
            </TouchableOpacity>
        </View>
    );
}
export default HomeScreen;