import { type NavigatorScreenParams } from '@react-navigation/native';

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      '(tabs)': NavigatorScreenParams<{
        home: undefined;
        admin: undefined;
        profile: undefined;
      }>;
      'admin/add-bus': undefined;
      'admin/[id]': { id: string };
    }
  }
}
