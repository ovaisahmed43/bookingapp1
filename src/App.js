import React, {useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Pages
import HomePage from './HomePage';
import BookingPage from './BookingPage';
import PlotsPage from './PlotsPage';
import SalesPurchasePage from './SalesPurchasePage';
import ReportPage from './ReportPage';
import AdminPage from './AdminPage';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    setTimeout(async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
      } catch (err) {
        console.warn(err);
      }
      const readGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      const writeGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (!readGranted || !writeGranted) {
        console.log('Read and write permissions have not been granted');
        return;
      }
    }, 0);
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Booking" component={BookingPage} />
          <Stack.Screen name="Plots" component={PlotsPage} />
          <Stack.Screen name="SalesPurchase" component={SalesPurchasePage} />
          <Stack.Screen name="Report" component={ReportPage} />
          <Stack.Screen name="Admin" component={AdminPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
