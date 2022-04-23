import React, {useState, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  Fab,
  Modal,
  View,
  Select,
  useToast,
  AddIcon,
  CloseIcon,
} from 'native-base';
import Header from '../components/Header';
import {arrayRemove, formatNumber, pad} from '../utils';
// import * as RNFS from 'react-native-fs';
import {storage} from '../utils/storage';

const DEFAULT_INPUTS = {
  transaction_number: '',
  transaction_date: '',
  customer_name: '',
  customer_phone: '',
  transaction_type: 'Purchase',
  transaction_status: 'Normal',
  plot_no: '',
  quantity: '0',
  rate: '0',
  amount: '0',
};

// const FILE_PATH = RNFS.DownloadDirectoryPath + '/booking_app_data.json';
// let FILE_DATA = {};

const SalesPurchasePage = () => {
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [plots, setPlots] = useState([]);
  const [records, setRecords] = useState([]);
  const [settings, setSettings] = useState({
    quantity: '0',
    rate: '0',
    total_plots: '0',
  });
  const [errors, setErrors] = React.useState({});
  const [inputs, setInputs] = useState({...DEFAULT_INPUTS, id: '1'});
  const [recordIdsToDelete, setRecordIdsToDelete] = useState([]);

  const validate = () => {
    if (inputs.quantity == undefined) {
      setErrors({...errors, quantity: 'Quantity is required'});
      return false;
    }

    if (Number.isNaN(inputs.quantity)) {
      setErrors({...errors, quantity: 'Must be a valid number'});
      return false;
    }

    if (inputs.rate == undefined) {
      setErrors({...errors, rate: 'Rate is required'});
      return false;
    }

    if (Number.isNaN(inputs.rate)) {
      setErrors({...errors, rate: 'Must be a valid number'});
      return false;
    }

    return true;
  };

  const handleInputChange = (name, value) => {
    if (name == 'plot_no') {
      const plot = plots.filter(plot => plot['plot_no'] == value);
      setInputs({
        ...inputs,
        [name]: value,
        rate: plot.length > 0 ? plot[0]['rate'] ?? 0 : 0,
        quantity: plot.length > 0 ? plot[0]['sqyd'] ?? 0 : 0,
        amount: plot.length > 0 ? plot[0]['rate'] * plot[0]['sqyd'] ?? 0 : 0,
      });
    } else {
      setInputs({...inputs, [name]: value});
    }
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

  const handleAddTransaction = () =>
    setTimeout(() => {
      if (validate()) {
        const date = new Date();
        const r = [
          {
            ...inputs,
            id: inputs.id,
            transaction_number: 'T' + pad(inputs.id, 6),
            transaction_date: date.toISOString(),
            amount: parseFloat(inputs.quantity) * parseFloat(inputs.rate),
          },
          ...records,
        ];
        storage.set('records', JSON.stringify(r));
        setPlots(r);
        toast.show({title: 'Added!'});

        // RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
        //   .then(success => {
        //     toast.show({title: 'Added!'});
        //     setModalOpen(false);
        //     setTimeout(() => {
        //       readData();
        //     }, 500);
        //   })
        //   .catch(err => {
        //     toast.show({title: err.message});
        //   });
      }
    }, 0);

  const handleUpdateTransaction = () =>
    setTimeout(() => {
      if (validate()) {
        const r = (records ?? []).map(record => {
          if (record['id'] === inputs.id) {
            return {
              ...inputs,
              amount: parseFloat(inputs.quantity) * parseFloat(inputs.rate),
            };
          } else {
            return record;
          }
        });
        storage.set('records', JSON.stringify(r));
        setPlots(r);
        toast.show({title: 'Updated!'});

        // RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
        //   .then(success => {
        //     toast.show({title: 'Updated!'});
        //     setModalOpen(false);
        //     setTimeout(() => {
        //       readData();
        //       toast.show({title: JSON.stringify(inputs)});
        //     }, 500);
        //   })
        //   .catch(err => {
        //     toast.show({title: err.message});
        //   });
      }
    }, 0);

  const handleDeleteTransaction = () => {
    const r = (records ?? []).filter(
      record => !recordIdsToDelete.includes(record['id']),
    );
    storage.set('records', JSON.stringify(r));
    setPlots(r);
    toast.show({title: 'Deleted!'});

    // RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
    //   .then(success => {
    //     toast.show({title: 'Deleted!'});
    //     setRecordIdsToDelete([]);
    //     readData();
    //   })
    //   .catch(err => {
    //     toast.show({title: err.message});
    //   });
  };

  const handleOnChecked = id => {
    let filtered = recordIdsToDelete;
    if (filtered.includes(id)) {
      filtered = arrayRemove(filtered, id);
      toast.show({title: 'Unselected', duration: 1000});
    } else {
      filtered.push(id);
      toast.show({title: 'Selected', duration: 1000});
    }
    setRecordIdsToDelete(filtered);
  };

  return (
    <SafeAreaView style={{minHeight: '100%'}}>
      <Header title={'Sale/Re-Purchase'} />
      <Box style={{padding: 8}}>
        <Text style={{fontSize: 18}}>Total {settings.total_plots} Plots</Text>
      </Box>
      <Box style={{padding: 8}}>
        <FlatList
          data={records ?? []}
          renderItem={({item: record}) => {
            const selected = recordIdsToDelete.includes(record['id']);
            return (
              <TouchableOpacity
                key={'record-' + record['id']}
                onPress={() => {
                  setTimeout(() => {
                    setInputs(record);
                    setModalOpen(true);
                  }, 0);
                }}
                style={{
                  backgroundColor: '#ddd',
                  borderRadius: 4,
                  paddingHorizontal: 10,
                  marginVertical: 5,
                }}>
                <Box flexDirection={'row'}>
                  <Box justifyContent={'center'} paddingRight={'8px'}>
                    <TouchableOpacity
                      onPress={() => handleOnChecked(record['id'])}>
                      <View
                        height={25}
                        width={25}
                        overflow={'hidden'}
                        borderWidth={2}
                        borderRadius={50}
                        backgroundColor={selected ? 'danger.500' : 'gray.300'}
                        borderColor={selected ? 'danger.500' : '#333'}
                      />
                    </TouchableOpacity>
                  </Box>
                  <Box flex={1}>
                    <Box flexDirection={'row'} justifyContent={'space-between'}>
                      <Box>
                        <Text>{record['customer_name'] ?? ''}</Text>
                      </Box>
                      <Box>
                        <Text style={{fontWeight: 'bold'}}>
                          {record['transaction_number'] ?? ''}
                        </Text>
                      </Box>
                    </Box>
                    <Box flexDirection={'row'} justifyContent={'space-between'}>
                      <Box>
                        <Text>{`${record['transaction_type']} - ${record['transaction_status']}`}</Text>
                      </Box>
                      <Box>
                        <Text>
                          {`${record['rate']} (x${record['quantity']}) = `}
                          <Text style={{fontWeight: 'bold'}}>
                            {`${formatNumber(record['amount'])}/-`}
                          </Text>
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </TouchableOpacity>
            );
          }}
          keyExtractor={item => item['id']}
        />
      </Box>

      <Modal
        avoidKeyboard
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          readData();
        }}>
        <Modal.Content width={'100%'}>
          <Modal.CloseButton />
          <Modal.Header>{`${
            inputs.transaction_number !== '' ? 'Update' : 'Add'
          } Sale/Re-Purchase`}</Modal.Header>
          <Modal.Body>
            <Box style={{padding: 8}}>
              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Customer Name</FormControl.Label>
                <Input
                  variant={'underlined'}
                  keyboardType={'default'}
                  value={(inputs.customer_name ?? '').toString()}
                  onChangeText={value =>
                    handleInputChange('customer_name', value)
                  }
                />
                <FormControl.ErrorMessage>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Customer Phone #</FormControl.Label>
                <Input
                  variant={'underlined'}
                  keyboardType={'default'}
                  value={(inputs.customer_phone ?? '').toString()}
                  onChangeText={value =>
                    handleInputChange('customer_phone', value)
                  }
                />
                <FormControl.ErrorMessage>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Type of Trasaction</FormControl.Label>
                <Select
                  variant={'underlined'}
                  selectedValue={inputs.transaction_type}
                  onValueChange={transaction_type =>
                    handleInputChange('transaction_type', transaction_type)
                  }>
                  <Select.Item label="Purchase" value="Purchase" />
                  <Select.Item label="Sale" value="Sale" />
                </Select>
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Status of Trasaction</FormControl.Label>
                <Select
                  variant={'underlined'}
                  selectedValue={inputs.transaction_status}
                  onValueChange={transaction_status =>
                    handleInputChange('transaction_status', transaction_status)
                  }>
                  <Select.Item label="Normal" value="Normal" />
                  <Select.Item label="Sale" value="Sale" />
                  <Select.Item label="Repurchase" value="Repurchase" />
                </Select>
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Plot No.</FormControl.Label>
                <Select
                  variant={'underlined'}
                  selectedValue={inputs.plot_no}
                  onValueChange={plot_no =>
                    handleInputChange('plot_no', plot_no)
                  }>
                  {(plots ?? []).map(plot => {
                    return (
                      <Select.Item
                        key={`plot-${plot['plot_no']}`}
                        label={plot['plot_no']}
                        value={plot['plot_no']}
                      />
                    );
                  })}
                </Select>
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Quantity</FormControl.Label>
                <Input
                  variant={'underlined'}
                  keyboardType={'decimal-pad'}
                  value={(inputs.quantity ?? '').toString()}
                  onChangeText={value => handleInputChange('quantity', value)}
                />
                <FormControl.ErrorMessage>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={errors?.rate}
                style={{marginVertical: 8}}>
                <FormControl.Label>Rate (per SQYD)</FormControl.Label>
                <Input
                  variant={'underlined'}
                  keyboardType={'decimal-pad'}
                  value={(inputs.rate ?? '').toString()}
                  onChangeText={value => handleInputChange('rate', value)}
                />
                {errors?.rate ? (
                  <FormControl.ErrorMessage>
                    {errors?.rate}
                  </FormControl.ErrorMessage>
                ) : null}
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Amount</FormControl.Label>
                <Input
                  isReadOnly
                  variant={'underlined'}
                  keyboardType={'decimal-pad'}
                  value={(
                    parseFloat(inputs.rate ?? '0') *
                    parseFloat(inputs.quantity ?? '0')
                  ).toString()}
                  onChangeText={value => handleInputChange('amount', value)}
                />
              </FormControl>

              <Button
                width={'full'}
                onPress={
                  inputs.transaction_number !== ''
                    ? handleUpdateTransaction
                    : handleAddTransaction
                }
                style={{marginVertical: 4}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 'bold',
                    lineHeight: 30,
                  }}>
                  Submit
                </Text>
              </Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {recordIdsToDelete.length > 0 ? (
        <Fab
          icon={<CloseIcon color="white" size="sm" />}
          backgroundColor={'danger.500'}
          onPress={() => handleDeleteTransaction()}
        />
      ) : (
        <Fab
          icon={<AddIcon color="white" size="sm" />}
          backgroundColor={'info.500'}
          onPress={() => {
            setInputs({...inputs, ...DEFAULT_INPUTS});
            setModalOpen(true);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default SalesPurchasePage;
