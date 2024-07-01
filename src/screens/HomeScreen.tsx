import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import {FlashList} from '@shopify/flash-list';
import {useDispatch, useSelector} from 'react-redux';
import BackgroundTimer from 'react-native-background-timer';
import {Colors} from '../utils/colors';
import {getCoinList, getLatestQuotes} from '../redux/actions/coinService';
import {AppDispatch, RootState} from '../redux/store';
import {formatCurrency} from '../utils/functions';
import _ from 'lodash';
import ScreenPlaceHolder from '../components/ScreenPlaceHolder';
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {AppAlert} from '../components/AppAlert';
import {setIsLoading} from '../redux/reducers/coinReducer';

const ITEMS_PER_CALL = 100;
const TIME_PER_UPDATE = 60 * 1000; // 60s

function HomeScreen(): React.JSX.Element {
  const [searchText, setSearchText] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const {coinList, isLoading, isUpdating} = useSelector(
    (state: RootState) => state.coinState,
  );
  const [list, setList] = useState(coinList);
  const [page, setPage] = useState(coinList.length / ITEMS_PER_CALL);
  const {isConnected} = useNetInfo();

  useEffect(() => {
    if (coinList.length === 0) {
      fetchData()();
    }
    BackgroundTimer.runBackgroundTimer(async () => {
      const state = await NetInfo.refresh();
      if (!state.isConnected) {
        return;
      }
      if (coinList.length === 0) {
        fetchData()();
      } else {
        const listIds = coinList.map((item: any) => item.id);
        // limit to first 100 coin to get update
        listIds.length = ITEMS_PER_CALL;
        dispatch(getLatestQuotes({listIds}));
      }
    }, TIME_PER_UPDATE);

    return () => BackgroundTimer.stopBackgroundTimer();
  }, []);

  useEffect(() => {
    setList(coinList);
  }, [coinList]);

  const fetchData =
    (refresh = false) =>
    async () => {
      if (searchText !== '') {
        return;
      }
      const state = await NetInfo.refresh();
      if (!state.isConnected) {
        // show placeholder loading when there's no data & no connection
        dispatch(setIsLoading(coinList.length === 0));
        AppAlert({title: 'No internet connection.'});
        return;
      }
      const limit = refresh ? ITEMS_PER_CALL : (page + 1) * ITEMS_PER_CALL;

      await dispatch(getCoinList({limit}));
      setPage(refresh ? 1 : page + 1);
    };

  const fetchDataDebounced = useCallback(
    _.debounce(async () => {
      const state = await NetInfo.refresh();
      if (!state.isConnected) {
        return;
      }
      const limit = (page + 1) * ITEMS_PER_CALL;

      await dispatch(getCoinList({limit}));
      setPage(page + 1);
    }, 200),
    [page],
  );

  const clearSearchText = () => {
    setSearchText('');
    setList(coinList);
  };

  const debounceSearch = useCallback(
    _.debounce(text => {
      if (text === '') {
        setList(coinList);
      } else {
        setList(
          coinList.filter((item: any) =>
            [item.name.toLowerCase(), item.symbol.toLowerCase()].some(value =>
              value.includes(text.toLowerCase()),
            ),
          ),
        );
      }
    }, 500),
    [coinList],
  );

  const onChangeText = text => {
    setSearchText(text);
    debounceSearch(text);
  };

  const onEndReached = () => {
    if (searchText === '') {
      // don't allow it to fetch more when user just search in the list
      fetchDataDebounced();
    }
  };

  const renderItem = ({item, index}) => {
    const {percent_change_1h, price} = item.quote.USD;

    return (
      <View style={styles.rowBetween}>
        <View>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.coinName}>{item.name}</Text>
        </View>
        <View style={styles.coinValue}>
          <Text
            style={{
              color: percent_change_1h > 0 ? Colors.green : Colors.red,
            }}>
            {Number(percent_change_1h.toPrecision(2)) + '%'}
          </Text>
          <Text style={styles.price}>{`$${formatCurrency(
            price.toFixed(price < 1 ? 6 : 2),
          )}`}</Text>
        </View>
      </View>
    );
  };

  const renderListFooter = () => {
    if (isLoading) {
      return null;
    }
    if (searchText !== '') {
      if (list.length > 0) {
        return null;
      }
      return (
        <Text style={styles.message}>{'No coin name / symbol was found.'}</Text>
      );
    }
    return (
      <View style={styles.footerLoader}>
        {isConnected ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.message}>{'No internet connection.'}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <FontistoIcon name={'search'} size={18} color={Colors.black} />
        <TextInput
          value={searchText}
          onChangeText={onChangeText}
          cursorColor={Colors.black}
          style={styles.input}
        />
        {searchText !== '' && (
          <IoniconsIcon
            name={'close-circle'}
            size={18}
            color={Colors.gray}
            onPress={clearSearchText}
          />
        )}
      </View>
      {list.length === 0 && isLoading ? (
        <ScreenPlaceHolder />
      ) : (
        <FlashList
          data={list}
          renderItem={renderItem}
          estimatedItemSize={55}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isUpdating}
              onRefresh={fetchData(true)}
              tintColor={Colors.white}
            />
          }
          contentContainerStyle={styles.scrollViewContent}
          ItemSeparatorComponent={() => <View style={{height: 25}} />}
          onScrollBeginDrag={Keyboard.dismiss}
          onEndReached={onEndReached}
          onEndReachedThreshold={list.length === 0 ? 0 : 5}
          ListFooterComponent={renderListFooter}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inputContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
    height: 48,
    backgroundColor: Colors.input,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    marginHorizontal: 10,
  },
  scrollViewContent: {
    paddingTop: 10,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLoader: {
    justifyContent: 'center',
    height: 80,
  },
  symbol: {color: Colors.white},
  coinName: {color: Colors.gray, fontSize: 12},
  coinValue: {alignItems: 'flex-end'},
  price: {color: Colors.white, fontSize: 12},
  message: {color: Colors.white, textAlign: 'center'},
});

export default HomeScreen;
