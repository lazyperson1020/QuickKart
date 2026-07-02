import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {children}
    </SafeAreaView>
  );
};

export default AppWrapper;
