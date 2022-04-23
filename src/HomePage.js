import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {Box, Button, Text, useToast} from 'native-base';
import Header from '../components/Header';
// import * as RNFS from 'react-native-fs';
import {storage} from '../utils/storage';

// const FILE_PATH = RNFS.DownloadDirectoryPath + '/booking_app_data.json';
// let FILE_DATA = {};

const HomePage = ({navigation}) => {
  const toast = useToast();

  // const [settings, setSettings] = useState({
  //   quantity: '0',
  //   rate: '0',
  //   total_plots: '0',
  // });
  // const [plots, setPlots] = useState([]);
  // const [records, setRecords] = useState([]);

  // const readData = () => {
  //   RNFS.exists(FILE_PATH)
  //     .then(exist => {
  //       if (exist) {
  //         RNFS.readFile(FILE_PATH)
  //           .then(res => {
  //             FILE_DATA = JSON.parse(res);
  //             setSettings(
  //               FILE_DATA['settings'] ?? {
  //                 quantity: '0',
  //                 rate: '0',
  //                 total_plots: '0',
  //               },
  //             );
  //             setRecords(FILE_DATA['records'] ?? []);
  //             setPlots(FILE_DATA['plots'] ?? []);
  //           })
  //           .catch(err => {
  //             toast.show({title: err.message});
  //           });
  //       } else {
  //         toast.show({title: 'File not exist!'});
  //       }
  //     })
  //     .catch(err => {
  //       toast.show({title: err.message});
  //     });
  // };

  const readData = () => {
    const hasRecords = storage.contains('records');
    if (!hasRecords) storage.set('records', JSON.stringify([]));

    const hasPlots = storage.contains('plots');
    if (!hasPlots) storage.set('plots', JSON.stringify([]));

    const hasSettings = storage.contains('settings');
    if (!hasSettings)
      storage.set(
        'settings',
        JSON.stringify({
          quantity: '0',
          rate: '0',
          total_plots: '0',
        }),
      );
  };

  useEffect(readData, []);

  return (
    <SafeAreaView style={{minHeight: '100%'}}>
      <Header title={'Welcome'} />
      <Box justifyContent={'center'} style={{padding: 8, flex: 1}}>
        <Button
          width={'full'}
          onPress={() => {
            setTimeout(() => navigation.navigate('Booking'), 0);
          }}
          style={{marginVertical: 4}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 'bold',
              lineHeight: 30,
            }}>
            Booking
          </Text>
        </Button>
        <Button
          width={'full'}
          onPress={() => {
            setTimeout(() => navigation.navigate('Plots'), 0);
          }}
          style={{marginVertical: 4}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 'bold',
              lineHeight: 30,
            }}>
            Plots
          </Text>
        </Button>
        <Button
          width={'full'}
          onPress={() => {
            setTimeout(() => navigation.navigate('SalesPurchase'), 0);
          }}
          style={{marginVertical: 4}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 'bold',
              lineHeight: 30,
            }}>
            Sales/Re-Purchase
          </Text>
        </Button>
        <Button
          width={'full'}
          onPress={() => {
            setTimeout(() => navigation.navigate('Report'), 0);
          }}
          style={{marginVertical: 4}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 'bold',
              lineHeight: 30,
            }}>
            Report
          </Text>
        </Button>
        <Button
          width={'full'}
          onPress={() => {
            setTimeout(() => navigation.navigate('Admin'), 0);
          }}
          style={{marginVertical: 4}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 'bold',
              lineHeight: 30,
            }}>
            Administrator
          </Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
};

export default HomePage;
