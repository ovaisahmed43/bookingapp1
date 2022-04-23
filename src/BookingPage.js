import React, {useState, useEffect, memo, useCallback, useRef} from 'react';
import {
  Modal,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Box, Button, Text} from 'native-base';
import Header from '../components/Header';
import {formatNumber} from '../utils';
import {storage} from '../utils/storage';

const DEFAULT_INPUTS = {
  plot_no: '',
  sqyd: '0',
  rate: '0',
  amount: '0',
  type: 'UNSOLD',
};

const BookingPage = () => {
  const modal = useRef(null);

  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    quantity: '0',
    rate: '0',
    total_plots: '0',
  });
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [plots, setPlots] = useState([]);
  const [records, setRecords] = useState([]);

  const readRecords = useCallback(async () => {
    const hasRecords = storage.contains('records');
    if (hasRecords) {
      const s = storage.getString('records') ?? [];
      setRecords(JSON.parse(s));
    }
  }, []);

  useEffect(() => {
    readRecords();
  }, []);

  const readPlots = useCallback(async () => {
    const hasPlots = storage.contains('plots');
    if (hasPlots) {
      const s = storage.getString('plots') ?? [];
      setPlots(JSON.parse(s));
    }
  }, []);

  useEffect(() => {
    readPlots();
  }, []);

  const readSettings = useCallback(async () => {
    const hasSettings = storage.contains('settings');
    if (hasSettings) {
      const s =
        storage.getString('settings') ??
        "{quantity:'0',rate:'0',total_plots:'0'}";
      setSettings(JSON.parse(s));
    }
  }, []);

  useEffect(() => {
    readSettings();
  }, []);

  const handleUpdatePlot = useCallback(
    (type = 'UNSOLD') => {
      setTimeout(() => {
        setLoading(true);
        const p = (plots ?? []).map(plot => {
          if (plot['plot_no'] === inputs.plot_no) {
            return {...inputs, type};
          } else {
            return plot;
          }
        });
        storage.set('plots', JSON.stringify(p));
        setPlots(p);
        setInputs(DEFAULT_INPUTS);
      }, 0);
    },
    [plots],
  );

  const filteredRecords = (records ?? []).filter(
    record => record['plot_no'] == inputs.plot_no,
  );

  const onClick = useCallback(plot => {
    setInputs(plot);
  }, []);

  const Item = memo(
    ({plot, onItemClick}) => {
      // plot = JSON.parse(plot);

      console.log({plot});

      return (
        <TouchableOpacity
          key={'plot-' + plot['plot_no']}
          onPress={() => onItemClick(plot)}>
          <Box
            flexDirection={'row'}
            style={{
              height: 40,
              backgroundColor: '#ddd',
              borderRadius: 4,
              paddingHorizontal: 10,
              marginVertical: 5,
            }}>
            <Box width={'40px'} justifyContent={'center'} alignItems={'center'}>
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
              <Box flexDirection={'row'} justifyContent={'space-between'}>
                <Text style={{fontWeight: 'bold'}}>
                  {`${plot['sqyd'] ?? 0} sqyd - ${plot['type']}`}
                </Text>
                <Text>{`${formatNumber(plot['amount'] ?? 0)}/-`}</Text>
              </Box>
            </Box>
          </Box>
        </TouchableOpacity>
      );
    },
    (_prevPlot, _nextPlot) => {
      const prevPlot = _prevPlot.plot;
      const nextPlot = _nextPlot.plot;

      const areEqual =
        prevPlot['plot_no'] == nextPlot['plot_no'] &&
        prevPlot['type'] == nextPlot['type'];

      return areEqual;
    },
  );

  const renderItem = ({item}) => {
    return (
      <Item key={`item-${item['plot_no']}`} plot={item} onItemClick={onClick} />
    );
  };

  const keyExtractor = item => item['plot_no'];

  return (
    <SafeAreaView style={{minHeight: '100%'}}>
      <Header title={'Booking'} />
      <Box
        flexDirection={'row'}
        justifyContent={'space-between'}
        style={{padding: 8}}>
        <Text style={{fontSize: 18}}>Total {(plots ?? []).length} Plots</Text>
        {loading ? <ActivityIndicator /> : null}
      </Box>
      <Box flex={1} style={{padding: 8}}>
        <FlatList
          renderToHardwareTextureAndroid
          removeClippedSubviews={true}
          initialNumToRender={25}
          maxToRenderPerBatch={50}
          numColumns={1}
          data={JSON.parse(JSON.stringify(plots ?? []))}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </Box>

      <Modal
        ref={modal}
        animationType="slide"
        transparent={true}
        visible={inputs.plot_no !== ''}
        onRequestClose={() => {
          setInputs(DEFAULT_INPUTS);
        }}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              setInputs(DEFAULT_INPUTS);
            }}
          />
          <View
            style={{
              marginTop: 20,
              backgroundColor: 'white',
            }}>
            <Header title={`Plot ${inputs.plot_no}`} />
            <View
              style={{paddingHorizontal: 8, paddingBottom: 4, width: '100%'}}>
              {inputs.type !== 'SOLD' ? (
                <Button
                  bgColor={'success.400'}
                  onPress={() => handleUpdatePlot('SOLD')}
                  style={{marginVertical: 4}}>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    Mark as{' '}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 30,
                      }}>
                      SOLD
                    </Text>
                  </Text>
                </Button>
              ) : null}

              {inputs.type !== 'UNSOLD' ? (
                <Button
                  bgColor={'danger.400'}
                  onPress={() => handleUpdatePlot('UNSOLD')}
                  style={{marginVertical: 4}}>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    Mark as{' '}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 30,
                      }}>
                      UNSOLD
                    </Text>
                  </Text>
                </Button>
              ) : null}

              {inputs.type !== 'HOLD' ? (
                <Button
                  bgColor={'warning.400'}
                  onPress={() => handleUpdatePlot('HOLD')}
                  style={{marginVertical: 4}}>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    Mark as{' '}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 30,
                      }}>
                      HOLD
                    </Text>
                  </Text>
                </Button>
              ) : null}

              {inputs.type !== 'UNHOLD' ? (
                <Button
                  bgColor={'info.400'}
                  onPress={() => handleUpdatePlot('UNHOLD')}
                  style={{marginVertical: 4}}>
                  <Text
                    style={{
                      color: '#fff',
                    }}>
                    Mark as{' '}
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        lineHeight: 30,
                      }}>
                      UNHOLD
                    </Text>
                  </Text>
                </Button>
              ) : null}
            </View>
          </View>
          {filteredRecords.length > 0 ? (
            <Box style={{padding: 8, backgroundColor: 'white'}}>
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
          ) : null}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookingPage;
