import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, BackHandler, Platform, FlatList } from 'react-native';
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

function HistoryScreen({ route, navigation }) {
    const { data } = route.params;
    const [histories, setHistory] = useState([])
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getData()
    }, [])
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('app_histories')
            console.log("storage value", value)
            if (value !== null) {
                setHistory(JSON.parse(value))
            } else {

            }
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    }
    return (
        <View style={{ flex: 1, width: '100%', paddingVertical: 40, alignItems: 'center', backgroundColor: '#48C1F6' }}>
            <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', marginVertical: 10 }}>Data History</Text>
            <FlatList
                style={{ flex: 1, width: '100%', }}
                keyExtractor={(item, index) => item.id + ''}
                data={histories}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{ width: '80%', backgroundColor: 'white', alignSelf: 'center', borderRadius: 10, padding: 20, marginVertical: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View>
                                    <Text style={{ fontSize: 14, color: 'black' }}>{item.date}</Text>
                                    <Text style={{ fontSize: 14, color: 'black' }}>{item.location}</Text>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    const new_histories = histories.filter(his => his.id != item.id)
                                    setHistory(new_histories)
                                    AsyncStorage.setItem('app_histories', JSON.stringify(new_histories))
                                }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="trash" size={25} color="gray" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: 10 }}>
                                <Image source={{ uri: item.url }} style={{ width: 70, height: 70, resizeMode: 'contain' }} />
                                <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold' }}>{item.time}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{item.description}</Text>
                                <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold' }}>{item.temp}c</Text>
                            </View>
                        </View>
                    )
                }}
            />

            <View style={{ width: '80%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Return</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Platform.OS == 'ios' ? navigation.popToTop() : BackHandler.exitApp()} style={{ backgroundColor: 'white', padding: 10, paddingHorizontal: 25, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Exit</Text>
                </TouchableOpacity>
            </View>
            <Spinner
                visible={loading}
            />
        </View>
    );
}
export default HistoryScreen;