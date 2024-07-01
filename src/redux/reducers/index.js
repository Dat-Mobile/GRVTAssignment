import {combineReducers} from 'redux';
import coinReducer from './coinReducer';

const allReducers = combineReducers({
  coinState: coinReducer,
});

export default allReducers;
