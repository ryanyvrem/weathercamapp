import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, BackHandler, Platform } from 'react-native';
import moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage';

function WeatherScreen({ route, navigation }) {
    const [histories, setHistory] = useState([])

    const { data } = route.params;

    const weather = data?.weather && data.weather.length > 0 ? data.weather[0] : null
    const main = data?.main
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        const dataitem = {
            id: moment().valueOf(),
            date: moment().format('Do MMMM YYYY'),
            time: moment().format('HH:mm'),
            location: `${data?.name}${data?.sys ? ', ' + data?.sys.country : ''}`,
            url: `http://openweathermap.org/img/wn/${weather?.icon}@2x.png`,
            description: weather?.description,
            temp: main?.temp
        }
        let new_histories = histories
        try {
            const value = await AsyncStorage.getItem('app_histories')
            console.log("storage value", value)
            if (value !== null) {
                new_histories = JSON.parse(value)
                new_histories=[dataitem, ...new_histories]
            } else {
                new_histories = [dataitem]
            }
            setHistory(new_histories)
            await AsyncStorage.setItem('app_histories', JSON.stringify(new_histories))
        } catch (e) {
            new_histories = [dataitem]
            setHistory(new_histories)
            await AsyncStorage.setItem('app_histories', JSON.stringify(new_histories))
        }
    }

    return (
        <View style={{ flex: 1, paddingVertical: 40, alignItems: 'center', backgroundColor: '#48C1F6' }}>
            <Text style={{ fontSize: 30, color: 'black', fontWeight: 'bold', marginVertical: 20 }}>Today</Text>
            <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                <Text style={{ fontSize: 14, color: 'black' }}>{moment().format('Do MMMM YYYY')}</Text>
                <Text style={{ fontSize: 14, color: 'black' }}>{data?.name}{data?.sys ? ', ' + data?.sys.country : ''}</Text>
                {
                    weather ?
                        <>
                            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 }}>
                                <Image source={{ uri: `http://openweathermap.org/img/wn/${weather.icon}@2x.png` }} style={{ width: 70, height: 70, resizeMode: 'contain' }} />
                                <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold' }}>{moment().format('HH:mm')}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{weather.description}</Text>
                                <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{main.temp}c</Text>
                            </View>
                        </> : null
                }
            </View>
            <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Return</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Platform.OS == 'ios' ? navigation.popToTop() : BackHandler.exitApp()} style={{ backgroundColor: 'white', padding: 10, paddingHorizontal: 25, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Exit</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => {
                navigation.navigate('History', { data: histories })
            }} style={{ backgroundColor: 'white', padding: 10, paddingHorizontal: 25, borderRadius: 10, marginTop: 30 }}>
                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Data History</Text>
            </TouchableOpacity>
        </View>
    );
}
export default WeatherScreen;