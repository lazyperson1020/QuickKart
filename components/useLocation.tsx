import { useState, useEffect, useRef, useCallback } from 'react';
import { Linking, AppState, AppStateStatus } from 'react-native';
import * as Location from 'expo-location';

// Survives component remounts (e.g. tab stack pushes) within the same JS session
let _locationInitialized = false;

export interface Locality {
  name: string;
  district: string;
}

interface LocationHook {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  localities: Locality[];
  loading: boolean;
  permissionStatus: Location.PermissionStatus | null;
  canAskAgain: boolean;
  errorMsg: string;
  refreshLocation: () => Promise<void>;
  requestLocationAccess: () => Promise<void>;
  openSettings: () => void;
}

const NEARBY_OFFSETS = [
  { lat: 0.01,  lng: 0      },
  { lat: -0.01, lng: 0      },
  { lat: 0,     lng: 0.01   },
  { lat: 0,     lng: -0.01  },
  { lat: 0.015, lng: 0.015  },
  { lat: -0.015, lng: -0.015 },
];

const fetchNearbyLocalities = async (latitude: number, longitude: number): Promise<Locality[]> => {
  const results = await Promise.allSettled(
    NEARBY_OFFSETS.map(offset =>
      Location.reverseGeocodeAsync({
        latitude: latitude + offset.lat,
        longitude: longitude + offset.lng,
      })
    )
  );
  
  const seen = new Set<string>();
  const localities: Locality[] = [];
  
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      const item = result.value[0];
      const name = item.district || item.subregion || item.name || '';
      const district = item.subregion || item.city || '';
      if (name && !seen.has(name)) {
        seen.add(name);
        localities.push({ name, district });
      }
    }
  }
  return localities;
};

const useLocation = (): LocationHook => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('Loading address...');
  const [city, setCity] = useState('');
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const isFetchingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const fetchLocationData = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (response && response.length > 0) {
        const item = response[0];
        const formatted = `${item.name || ''} ${item.street || ''}, ${item.city || ''}`.trim();
        setAddress(formatted || 'Unknown Location');
        setCity(item.city || item.subregion || '');
      } else {
        setAddress('Unknown Location');
      }
    } catch {
      setAddress('Unknown Location');
    }

    try {
      const nearby = await fetchNearbyLocalities(lat, lng);
      setLocalities(nearby);
    } catch {
      setLocalities([]);
    }
  }, []);

  const getLocation = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      await fetchLocationData(coords.latitude, coords.longitude);
      setErrorMsg('');
    } catch (e) {
      setErrorMsg('Could not retrieve your location.');
      setAddress('Location Unavailable');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchLocationData]);

  const requestLocationAccess = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { status, canAskAgain: askable } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      setCanAskAgain(askable);
      
      if (status === 'granted') {
        await getLocation();
      } else {
        setAddress('Location unavailable');
        setErrorMsg(
          askable
            ? 'Permission to access location was not granted.'
            : 'Location access is permanently denied. Please enable it in Settings.'
        );
      }
    } catch {
      setErrorMsg('An error occurred while requesting permission.');
    } finally {
      setLoading(false);
    }
  }, [getLocation]);

  const refreshLocation = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== 'granted') {
      await requestLocationAccess();
      return;
    }
    await getLocation();
  }, [getLocation, requestLocationAccess]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAndCheckPermissions = async () => {
      if (_locationInitialized) return;
      _locationInitialized = true;

      const { status, canAskAgain: askable } = await Location.getForegroundPermissionsAsync();

      setPermissionStatus(status);
      setCanAskAgain(askable);

      if (!isMounted) return;

      if (status === 'granted') {
        await getLocation();
      } else {
        setAddress('Location unavailable');
        setLoading(false);
      }
    };

    initializeAndCheckPermissions();

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        const { status, canAskAgain: askable } = await Location.getForegroundPermissionsAsync();
        
        if (!isMounted) return;
        setPermissionStatus(status);
        setCanAskAgain(askable);

        if (status === 'granted' && !isFetchingRef.current) {
          await getLocation();
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    latitude,
    longitude,
    address,
    city,
    localities,
    loading,
    permissionStatus,
    canAskAgain,
    errorMsg,
    refreshLocation,
    requestLocationAccess,
    openSettings,
  };
};

export default useLocation;