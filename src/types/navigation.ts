import { AICreation } from './database';

export type RootStackParamList = {
  MainTabs: undefined;
  Detail: { creation: AICreation };
};

export type BottomTabParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
};
