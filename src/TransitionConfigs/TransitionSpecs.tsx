import { Easing } from 'react-native-reanimated';
import { TransitionSpec } from '../types';

export const TransitionSpecIOS: TransitionSpec = {
  timing: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_open_enter.xml
export const FadeInFromBottomAndroidSpec: TransitionSpec = {
  timing: 'timing',
  config: {
    duration: 350,
    easing: Easing.out(Easing.poly(5)),
  },
};

// See http://androidxref.com/7.1.1_r6/xref/frameworks/base/core/res/res/anim/activity_close_exit.xml
export const FadeOutToBottomAndroidSpec: TransitionSpec = {
  timing: 'timing',
  config: {
    duration: 150,
    easing: Easing.in(Easing.linear),
  },
};