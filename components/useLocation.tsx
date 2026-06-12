import { StyleSheet, Text, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import * as Location from 'expo-location'

const useLocation = () => {
    const [errorMsg,setErrorMsg] = useState("");
    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [address, setAddress] = useState("Loading address...");

    const getUserLocation = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){
            setErrorMsg('Permission to location was not granted.');
            setAddress("Permission Denied");
            return;
        }

        let {coords} = await Location.getCurrentPositionAsync();

        if(coords){
            const { latitude , longitude} = coords;
            setLatitude(latitude);
            setLongitude(longitude);
            let response = await Location.reverseGeocodeAsync({latitude, longitude});
            if (response && response.length > 0) {
                const item = response[0];
                // Formats something clean like: "123 Main St, Mumbai"
                const formatted = `${item.name || ''} ${item.street || ''}, ${item.city || ''}`;
                setAddress(formatted);
            } else {
                setAddress("Unknown Location");
            }
        }
    };

    useEffect(() => {
        getUserLocation();
    },[]);

  return { latitude, longitude, errorMsg, address};
}

export default useLocation

const styles = StyleSheet.create({})