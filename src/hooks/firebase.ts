import auth from '@react-native-firebase/auth';

export const useCurrentUser = () => auth().currentUser;
