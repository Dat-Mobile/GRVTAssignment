import {Alert, AlertButton} from 'react-native';
import {isiOS} from '../utils/constants';

export function AppAlert({
  title,
  message,
  onOK = (() => {}) as AlertButton,
  onCancel = (() => {}) as AlertButton,
}: {
  title: string;
  message?: string;
  onOK?: AlertButton;
  onCancel?: AlertButton;
}) {
  const titleOnly = !!title && !message;

  if (titleOnly) {
    return Alert.alert(isiOS ? title : '', isiOS ? '' : title);
  }
  return Alert.alert(title, message, [onCancel, onOK]);
}
