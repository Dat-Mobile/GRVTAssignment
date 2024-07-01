import axios, {HttpStatusCode} from 'axios';
import {AppAlert} from '../../components/AppAlert';
import {API_KEY} from '../../utils/constants';
import {
  setCoinList,
  setIsLoading,
  setIsUpdating,
} from '../reducers/coinReducer';
import {store} from '../store';

export const client = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com/',
  timeout: 10000,
});

const headers = {
  'X-CMC_PRO_API_KEY': API_KEY,
};

const handleError = response => {
  const message = response?.data?.status?.error_message || '';
  AppAlert({title: message});
};

export const getCoinList = params => dispatch =>
  new Promise(function (resolve, reject) {
    const {start = 1, limit = 100} = params;

    dispatch(setIsLoading(true));
    client
      .get(`v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}`, {
        headers,
      })
      .then(res => {
        if (res?.status === HttpStatusCode.Ok) {
          dispatch(setCoinList(res?.data?.data || []));
        }
        resolve(res);
      })
      .catch(err => {
        handleError(err.response);
        reject(err);
      })
      .finally(() => {
        setTimeout(() => dispatch(setIsLoading(false)), 300);
      });
  });

export const getLatestQuotes = params => dispatch =>
  new Promise(function (resolve, reject) {
    const {listIds} = params;
    const {coinList} = store.getState().coinState;

    if (listIds?.length === 0) {
      return;
    }

    dispatch(setIsUpdating(true));
    client
      .get(`v2/cryptocurrency/quotes/latest?id=${listIds.join(',')}`, {headers})
      .then(res => {
        if (res?.status === HttpStatusCode.Ok) {
          const newList = [...coinList];

          for (const [key, value] of Object.entries(res.data.data)) {
            const coinIndex = newList.findIndex(
              item => Number(item.id) === Number(key),
            );
            if (coinIndex !== -1) {
              newList[coinIndex] = value;
            }
          }
          dispatch(setCoinList(newList));
        }
        resolve(res);
      })
      .catch(err => {
        handleError(err.response);
        reject(err);
      })
      .finally(() => {
        dispatch(setIsUpdating(false));
      });
  });
