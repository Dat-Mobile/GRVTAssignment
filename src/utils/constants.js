import {Dimensions, Platform} from 'react-native';

const {height, width} = Dimensions.get('screen');
const isiOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';

export const API_KEY = '1fe3e7f9-7a6a-4fb2-ba10-3aa2ee0889a3';

export {height, width, isiOS, isAndroid};
