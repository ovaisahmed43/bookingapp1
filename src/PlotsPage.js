import React, {useState, useEffect} from 'react';
import {FlatList, SafeAreaView, TouchableNativeFeedback} from 'react-native';
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
import {storage} from '../utils/storage';

import plotJson from '../constants/plots.json';

const DEFAULT_INPUTS = {
  id: '1',
  plot_no: '',
  sqyd: '0',
  rate: '0',
  amount: '0',
  type: 'UNSOLD',
};

const PlotsPage = () => {
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
  const [plotsToDelete, setPlotsToDelete] = useState([]);

  const handleInputChange = (name, value) => {
    setInputs({...inputs, [name]: value});
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

  // useEffect(() => readData(), []);

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
  //             setInputs({
  //               ...inputs,
  //               id:
  //                 (FILE_DATA['plots'] ?? []).length > 0
  //                   ? (
  //                       parseInt(
  //                         Math.max(
  //                           ...(FILE_DATA['plots'] ?? []).map(
  //                             plot => plot['id'],
  //                           ),
  //                         ),
  //                       ) + 1
  //                     ).toString()
  //                   : '1',
  //               rate: FILE_DATA['settings']['rate'] ?? 0,
  //             });
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

  const handleAddPlot = () =>
    setTimeout(() => {
      // if (validate()) {
      toast.show({title: 'Adding...'});
      const p = [
        {
          ...inputs,
          id: inputs.id,
          amount: parseFloat(inputs.sqyd) * parseFloat(inputs.rate),
        },
        ...plots,
      ];
      storage.set('plots', JSON.stringify(p));
      setPlots(p);
      setModalOpen(false);
      toast.show({title: 'Added!'});

      // RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
      //   .then(success => {
      //     toast.show({title: 'Added!'});
      //     setModalOpen(false);
      //     setTimeout(() => {
      //       // readData();
      //     }, 500);
      //   })
      //   .catch(err => {
      //     toast.show({title: err.message});
      //   });
      // }
    }, 0);

  const handleUpdatePlot = () =>
    setTimeout(() => {
      // if (validate()) {
      toast.show({title: 'Updating...'});
      const p = (plots ?? []).map(plot => {
        if (plot['id'] === inputs.id) {
          return {
            ...inputs,
            amount: parseFloat(inputs.sqyd) * parseFloat(inputs.rate),
          };
        } else {
          return plot;
        }
      });
      storage.set('plots', JSON.stringify(p));
      setPlots(p);
      setModalOpen(false);
      toast.show({title: 'Updated!'});

      // RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
      //   .then(success => {
      //     toast.show({title: 'Updated!'});
      //     setModalOpen(false);
      //     setTimeout(() => {
      //       // readData();
      //     }, 500);
      //   })
      //   .catch(err => {
      //     toast.show({title: err.message});
      //   });
      // }
    }, 0);

  const handleDeletePlots = () => {
    toast.show({title: 'Deleting...'});
    const p = (plots ?? []).filter(plot => !plotsToDelete.includes(plot['id']));
    storage.set('plots', JSON.stringify(p));
    setPlots(p);
    setModalOpen(false);
    toast.show({title: 'Deleted!'});

    // RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
    //   .then(success => {
    //     toast.show({title: 'Deleted!'});
    //     setPlotsToDelete([]);
    //     // readData();
    //   })
    //   .catch(err => {
    //     toast.show({title: err.message});
    //   });
  };

  const handleOnChecked = id => {
    let filtered = plotsToDelete;
    if (filtered.includes(id)) {
      filtered = arrayRemove(filtered, id);
      toast.show({title: 'Unselected', duration: 1000});
    } else {
      filtered.push(id);
      toast.show({title: 'Selected', duration: 1000});
    }
    setPlotsToDelete(filtered);
  };

  const handleSetDefaultPlots = () =>
    setTimeout(() => {
      toast.show({title: 'Updating...'});
      storage.set('plots', JSON.stringify(plotJson));
      setPlots(plotJson);

      // FILE_DATA['plots'] = plotJson;
      // RNFS.writeFile(FILE_PATH, JSON.stringify(FILE_DATA))
      //   .then(success => {
      //     toast.show({title: 'Updated!'});
      //     setTimeout(() => {
      //       readData();
      //     }, 500);
      //   })
      //   .catch(err => {
      //     toast.show({title: err.message});
      //   });
    }, 0);

  // const filteredRecords = (records ?? []).filter(
  //   record => record['plot_no'] == inputs.plot_no,
  // );

  return (
    <SafeAreaView style={{minHeight: '100%'}}>
      <Header title={'Plots'} />
      <Box style={{padding: 8}}>
        <Text style={{fontSize: 18}}>Total {(plots ?? []).length} Plots</Text>
      </Box>
      <Box style={{padding: 8}}>
        <FlatList
          ListHeaderComponent={() => {
            return (
              <Button
                flex={1}
                bgColor={'info.400'}
                onPress={handleSetDefaultPlots}
                style={{marginVertical: 4}}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 'bold',
                    lineHeight: 30,
                  }}>
                  Reset to Default
                </Text>
              </Button>
            );
          }}
          data={plots ?? []}
          renderItem={({item: plot}) => {
            const selected = plotsToDelete.includes(plot['id']);
            return (
              <TouchableNativeFeedback
                key={'plot-' + plot['id']}
                onPress={() => {
                  setTimeout(() => {
                    setInputs(plot);
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
                    <TouchableNativeFeedback
                      onPress={() => handleOnChecked(plot['id'])}>
                      <View
                        height={25}
                        width={25}
                        overflow={'hidden'}
                        borderWidth={2}
                        borderRadius={50}
                        backgroundColor={selected ? 'danger.500' : 'gray.300'}
                        borderColor={selected ? 'danger.500' : '#333'}
                      />
                    </TouchableNativeFeedback>
                  </Box>
                  <Box
                    flex={1}
                    flexDirection={'row'}
                    style={{
                      height: 40,
                      backgroundColor: '#ddd',
                      borderRadius: 4,
                      paddingHorizontal: 10,
                      marginVertical: 5,
                    }}>
                    <Box
                      width={'40px'}
                      justifyContent={'center'}
                      alignItems={'center'}>
                      <Text
                        style={{
                          lineHeight: 20,
                          fontSize: 18,
                          fontWeight: 'bold',
                        }}>
                        {plot['plot_no'] ?? ''}
                      </Text>
                    </Box>
                    <Box
                      flex={1}
                      justifyContent={'center'}
                      paddingLeft={'8px'}
                      paddingRight={'8px'}>
                      <Box
                        flexDirection={'row'}
                        justifyContent={'space-between'}>
                        <Text style={{fontWeight: 'bold'}}>
                          {`${plot['sqyd'] ?? 0} sqyd - ${plot['type']}`}
                        </Text>
                        <Text>{`${formatNumber(plot['amount'] ?? 0)}/-`}</Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </TouchableNativeFeedback>
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
        }}>
        <Modal.Content width={'100%'}>
          <Modal.CloseButton />
          <Modal.Header>{`Plot No. ${inputs.plot_no}`}</Modal.Header>
          <Modal.Body>
            <Box style={{padding: 8}}>
              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Plot No.</FormControl.Label>
                <Input
                  variant={'underlined'}
                  keyboardType={'default'}
                  value={(inputs.plot_no ?? '').toString()}
                  onChangeText={value => handleInputChange('plot_no', value)}
                />
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>Type</FormControl.Label>
                <Select
                  variant={'underlined'}
                  selectedValue={inputs.type}
                  onValueChange={type => handleInputChange('type', type)}>
                  <Select.Item label="UNSOLD" value="UNSOLD" />
                  <Select.Item label="SOLD" value="SOLD" />
                  <Select.Item label="HOLD" value="HOLD" />
                  <Select.Item label="UNHOLD" value="UNHOLD" />
                </Select>
              </FormControl>

              <FormControl isRequired style={{marginVertical: 8}}>
                <FormControl.Label>SQYD</FormControl.Label>
                <Input
                  variant={'underlined'}
                  keyboardType={'decimal-pad'}
                  value={(inputs.sqyd ?? '0').toString()}
                  onChangeText={value => handleInputChange('sqyd', value)}
                />
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
                    parseFloat(inputs.sqyd ?? '0')
                  ).toString()}
                  onChangeText={value => handleInputChange('amount', value)}
                />
              </FormControl>

              <Button
                width={'full'}
                onPress={
                  inputs.plot_no !== '' ? handleUpdatePlot : handleAddPlot
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
            {/* {filteredRecords.length > 0 ? (
              <Box style={{padding: 8}}>
                <Text style={{fontWeight: 'bold'}}>Transactions</Text>

                {filteredRecords.map(record => {
                  return (
                    <Box
                      key={'record-' + record['id']}
                      flexDirection={'row'}
                      style={{
                        backgroundColor: '#ddd',
                        borderRadius: 4,
                        paddingHorizontal: 10,
                        marginVertical: 5,
                      }}>
                      <Box flex={1}>
                        <Box
                          flexDirection={'row'}
                          justifyContent={'space-between'}>
                          <Box>
                            <Text>{record['customer_name'] ?? ''}</Text>
                          </Box>
                          <Box>
                            <Text style={{fontWeight: 'bold'}}>
                              {record['transaction_number'] ?? ''}
                            </Text>
                          </Box>
                        </Box>
                        <Box
                          flexDirection={'row'}
                          justifyContent={'space-between'}>
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
                  );
                })}
              </Box>
            ) : null} */}
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {plotsToDelete.length > 0 ? (
        <Fab
          icon={<CloseIcon color="white" size="sm" />}
          backgroundColor={'danger.500'}
          onPress={() => handleDeletePlots()}
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

export default PlotsPage;
