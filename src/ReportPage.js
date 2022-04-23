import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {Box, Button, FormControl, Text, useToast} from 'native-base';
import * as RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import Header from '../components/Header';

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><style> body { font-family: 'Courier New', Courier, monospace; margin: 0px; } table { width: 100vw; margin: 10px 0px; } tr>th { border: 1px solid #ddd; background-color: #ddd; } tr { border: 1px solid #ddd; background-color: #eee; } </style></head><body><table><tbody><tr><th>Date From</th><td>:date_from:</td><th>Date To</th><td>:date_to:</td><th>Printed On</th><td>:printed_on:</td></tr></tbody></table><table><thead><tr><th>Transaction</th><th>Date</th><th>Customer Name</th><th>Customer Phone</th><th>Type</th><th>Status</th><th>Quantity</th><th>Rate</th><th>Amount</th></tr></thead><tbody>:TBODY:</tbody></table></body></html>`;
const row = `<tr><td>:transaction_number:</td><td>:transaction_date:</td><td>:customer_name:</td><td>:customer_phone:</td><td>:transaction_type:</td><td>:transaction_status:</td><td>:quantity:</td><td>:rate:</td><td>:amount:</td></tr>`;

const FILE_PATH = RNFS.DownloadDirectoryPath + '/booking_app_data.json';
let FILE_DATA = {};

const ReportPage = ({navigation}) => {
  const toast = useToast();
  const [filters, setFilters] = useState({
    date_from: new Date(),
    date_to: new Date(),
  });

  useEffect(() => readData(), []);

  const handleChange = (name, value) => {
    setFilters({...filters, [name]: value});
  };

  const handlePrint = async () => {
    let TBODY = '';
    (FILE_DATA['records'] ?? [])
      .filter(record => {
        const date = new Date(record['transaction_date']);
        return date >= filters.date_from && date <= filters.date_to;
      })
      .forEach(record => {
        const date = new Date(record['transaction_date']);
        const TR = row
          .replace(':transaction_number:', record['transaction_number'] ?? '')
          .replace(':transaction_date:', date.toDateString())
          .replace(':customer_name:', record['customer_name'] ?? '')
          .replace(':customer_phone:', record['customer_phone'] ?? '')
          .replace(':transaction_type:', record['transaction_type'] ?? '')
          .replace(':transaction_status:', record['transaction_status'] ?? '')
          .replace(':quantity:', record['quantity'] ?? '')
          .replace(':rate:', record['rate'] ?? '')
          .replace(':amount:', record['amount'] ?? '');

        TBODY += TR;
      });

    const date = new Date();

    let options = {
      html: html
        .replace(':date_from:', (filters.date_from ?? date).toDateString())
        .replace(':date_to:', (filters.date_to ?? date).toDateString())
        .replace(':printed_on:', date.toDateString())
        .replace(':TBODY:', TBODY),
      fileName: `report-${date.toDateString()}`,
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    // toast.show({title: `file://${file.filePath}`});
    Share.open({url: `file://${file.filePath}`})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  const readData = () => {
    RNFS.exists(FILE_PATH)
      .then(exist => {
        if (exist) {
          RNFS.readFile(FILE_PATH)
            .then(res => {
              FILE_DATA = JSON.parse(res);
            })
            .catch(err => {
              toast.show({title: err.message});
            });
        } else {
          toast.show({title: 'File not exist!'});
        }
      })
      .catch(err => {
        toast.show({title: err.message});
      });
  };

  return (
    <SafeAreaView style={{minHeight: '100%'}}>
      <Header title={'Print'} />
      <Box style={{padding: 8, flex: 1}}>
        <FormControl style={{marginVertical: 8}}>
          <FormControl.Label>Date From</FormControl.Label>
          <Button
            width={'full'}
            onPress={() => {
              DateTimePickerAndroid.open({
                mode: 'date',
                value: filters.date_from,
                onChange: (e, date) => handleChange('date_from', date),
              });
            }}
            style={{marginVertical: 4}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 'bold',
                lineHeight: 30,
              }}>
              {filters.date_from.toDateString()}
            </Text>
          </Button>
        </FormControl>

        <FormControl style={{marginVertical: 8}}>
          <FormControl.Label>Date To</FormControl.Label>
          <Button
            width={'full'}
            onPress={() => {
              DateTimePickerAndroid.open({
                mode: 'date',
                value: filters.date_to,
                onChange: (e, date) => handleChange('date_to', date),
              });
            }}
            style={{marginVertical: 4}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 22,
                fontWeight: 'bold',
                lineHeight: 30,
              }}>
              {filters.date_to.toDateString()}
            </Text>
          </Button>
        </FormControl>
      </Box>
      <Box style={{padding: 8}}>
        <Button
          width={'full'}
          onPress={() => setTimeout(handlePrint, 0)}
          style={{marginVertical: 4}}>
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 'bold',
              lineHeight: 30,
            }}>
            Print
          </Text>
        </Button>
      </Box>
    </SafeAreaView>
  );
};

export default ReportPage;
