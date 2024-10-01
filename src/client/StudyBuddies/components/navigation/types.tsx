// navigation/types.ts
import { StackNavigationProp } from '@react-navigation/stack';

export type StudyStackParamList = {
  Study: undefined;
  StudyTimer: undefined;
  GoalSetting: undefined;
  TrackProgress: undefined;
};

export type StudyScreenNavigationProp = StackNavigationProp<StudyStackParamList, 'Study'>;
