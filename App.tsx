import React from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import HomeScreen from './src/screens/HomeScreen';
import {PersistGate} from 'redux-persist/integration/react';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <HomeScreen />
      </PersistGate>
    </Provider>
  );
}

export default App;
