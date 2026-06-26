import { useState, useEffect, useRef, useCallback } from 'react';
import { Linking, AppState, AppStateStatus, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

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
  permissionStatus: string | null;
  canAskAgain: boolean;
  errorMsg: string;
  refreshLocation: () => Promise<void>;
  requestLocationAccess: () => Promise<void>;
  openSettings: () => void;
}

const NEARBY_OFFSETS = [
  { lat: 0.01, lng: 0 },
  { lat: -0.01, lng: 0 },
  { lat: 0, lng: 0.01 },
  { lat: 0, lng: -0.01 },
  { lat: 0.015, lng: 0.015 },
  { lat: -0.015, lng: -0.015 },
];

async function reverseGeocode(latitude: number, longitude: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      { headers: { 'User-Agent': 'QuickkartApp/1.0' } }
    );
    const data = await res.json();
    return data.address ?? null;
  } catch {
    return null;
  }
}

async function fetchNearbyLocalities(latitude: number, longitude: number): Promise<Locality[]> {
  const results = await Promise.allSettled(
    NEARBY_OFFSETS.map(offset =>
      reverseGeocode(latitude + offset.lat, longitude + offset.lng)
    )
  );

  const seen = new Set<string>();
  const localities: Locality[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled' && result.value) {
      const addr = result.value;
      const name = addr.suburb || addr.neighbourhood || addr.village || addr.town || '';
      const district = addr.city || addr.county || addr.state_district || '';
      if (name && !seen.has(name)) {
        seen.add(name);
        localities.push({ name, district });
      }
    }
  }
  return localities;
}

async function requestAndroidPermission(): Promise<{ status: string; canAskAgain: boolean }> {
  try {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'QuickKart needs access to your location to show nearby stores.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return { status: 'granted', canAskAgain: true };
    } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return { status: 'denied', canAskAgain: false };
    }
    return { status: 'denied', canAskAgain: true };
  } catch {
    return { status: 'denied', canAskAgain: true };
  }
}

async function checkAndroidPermission(): Promise<{ status: string; canAskAgain: boolean }> {
  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return { status: granted ? 'granted' : 'denied', canAskAgain: !granted };
  } catch {
    return { status: 'denied', canAskAgain: true };
  }
}

const useLocation = (): LocationHook => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('Loading address...');
  const [city, setCity] = useState('');
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const isFetchingRef = useRef(false);
  const appStateRef = useRef(AppState.currentState);

  const fetchLocationData = useCallback(async (lat: number, lng: number) => {
    try {
      const addr = await reverseGeocode(lat, lng);
      if (addr) {
        const formatted = [addr.road, addr.suburb, addr.city].filter(Boolean).join(', ');
        setAddress(formatted || 'Unknown Location');
        setCity(addr.city || addr.town || addr.county || '');
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

    Geolocation.getCurrentPosition(
      async position => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        await fetchLocationData(lat, lng);
        setErrorMsg('');
        setLoading(false);
        isFetchingRef.current = false;
      },
      _error => {
        setErrorMsg('Could not retrieve your location.');
        setAddress('Location Unavailable');
        setLoading(false);
        isFetchingRef.current = false;
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
    );
  }, [fetchLocationData]);

  const requestLocationAccess = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');

    const { status, canAskAgain: askable } = await requestAndroidPermission();
    setPermissionStatus(status);
    setCanAskAgain(askable);

    if (status === 'granted') {
      await getLocation();
    } else {
      setAddress('Location unavailable');
      setLoading(false);
      setErrorMsg(
        askable
          ? 'Permission to access location was not granted.'
          : 'Location access is permanently denied. Please enable it in Settings.'
      );
    }
  }, [getLocation]);

  const refreshLocation = useCallback(async () => {
    const { status } = await checkAndroidPermission();
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

      const { status, canAskAgain: askable } = await checkAndroidPermission();
      if (!isMounted) return;

      setPermissionStatus(status);
      setCanAskAgain(askable);

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
        const { status, canAskAgain: askable } = await checkAndroidPermission();
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
