import React, {useState, useEffect} from 'react';
import {SafeAreaView, ScrollView} from 'react-native';
import {Box, Button, FormControl, Input, useToast, Text} from 'native-base';
import Share from 'react-native-share';
import * as RNFS from 'react-native-fs';
import Header from '../components/Header';
import {storage} from '../utils/storage';

const FILE_PATH = RNFS.DownloadDirectoryPath + '/booking_app_data.json';
// let FILE_DATA = {};

const AdminPage = ({navigation}) => {
  const toast = useToast();

  const [records, setRecords] = useState([]);
  const [plots, setPlots] = useState([]);
  const [settings, setSettings] = useState({
    quantity: '0',
    rate: '0',
    total_plots: '0',
  });

  const handleChange = (name, value) => {
    setSettings({...settings, [name]: value});
  };

  const readRecords = () => {
    const hasRecords = storage.contains('records');
    if (hasRecords) {
      const s = storage.getString('records') ?? [];
      setRecords(JSON.parse(s));
    }
  };

  useEffect(readRecords, []);

  const readPlots = () => {
    const hasPlots = storage.contains('plots');
    if (hasPlots) {
      const s = storage.getString('plots') ?? [];
      setPlots(JSON.parse(s));
    }
  };

  useEffect(readPlots, []);

  const readSettings = () => {
    const hasSettings = storage.contains('settings');
    if (hasSettings) {
      const s =
        storage.getString('settings') ??
        "{quantity:'0',rate:'0',total_plots:'0'}";
      setSettings(JSON.parse(s));
    }
  };

  useEffect(readSettings, []);

  const handleSave = () => {
    storage.set('settings', JSON.stringify(settings));
    navigation.goBack();
  };

  const handleExportData = () => {
    let FILE_DATA = {};
    FILE_DATA['records'] = records;
    FILE_DATA['plots'] = plots;
    FILE_DATA['settings'] = settings;
    RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
      .then(success => {
        Share.open({url: `file://${FILE_PATH}`})
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            err && console.log(err);
          });
      })
      .catch(err => {
        toast.show({title: err.message});
      });
  };

  return (
    <SafeAreaView style={{minHeight: '100%'}}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Header title={'Admin Settings'} />
        <Box style={{padding: 8}}>
          <FormControl isRequired style={{marginVertical: 8}}>
            <FormControl.Label>Default quantity</FormControl.Label>
            <Input
              variant={'underlined'}
              keyboardType={'decimal-pad'}
              value={(settings.quantity ?? '0').toString()}
              onChangeText={value => handleChange('quantity', value)}
            />
            {/* <FormControl.ErrorMessage>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage> */}
          </FormControl>

          <FormControl isRequired style={{marginVertical: 8}}>
            <FormControl.Label>Default Rate (per SQYD)</FormControl.Label>
            <Input
              variant={'underlined'}
              keyboardType={'decimal-pad'}
              value={(settings.rate ?? '0').toString()}
              onChangeText={value => handleChange('rate', value)}
            />
            {/* <FormControl.ErrorMessage>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage> */}
          </FormControl>

          <FormControl isRequired style={{marginVertical: 8}}>
            <FormControl.Label>Total Plots</FormControl.Label>
            <Input
              variant={'underlined'}
              keyboardType={'decimal-pad'}
              value={(settings.total_plots ?? '0').toString()}
              onChangeText={value => handleChange('total_plots', value)}
            />
            {/* <FormControl.ErrorMessage>
              Atleast 6 characters are required.
            </FormControl.ErrorMessage> */}
          </FormControl>

          <Button
            width={'full'}
            onPress={handleSave}
            style={{marginVertical: 4}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 'bold',
                lineHeight: 30,
              }}>
              Save
            </Text>
          </Button>

          <Button
            width={'full'}
            onPress={handleExportData}
            style={{marginVertical: 4}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 'bold',
                lineHeight: 30,
              }}>
              Export Data
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminPage;
