import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeStackParamList = {
  Map: undefined;
  RegionDetail: { regionId: string };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = NativeStackScreenProps<
  HomeStackParamList,
  T
>;

export type RootTabParamList = {
  chat: undefined;
  home: undefined;
  my: undefined;
};
