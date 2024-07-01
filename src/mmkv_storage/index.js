import {MMKV} from 'react-native-mmkv';

const encryptionKey = '_SECURE_SERVICE_';
const mmkvStorage = new MMKV({id: 'mmkv.default', encryptionKey});

export default mmkvStorage;
