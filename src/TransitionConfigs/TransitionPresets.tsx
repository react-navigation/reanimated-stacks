import {
  forHorizontalIOS,
  forVerticalIOS,
  forFadeFromBottomAndroid,
} from './CardStyleInterpolators';
import { forUIKit, forFade } from './HeaderStyleInterpolators';
import {
  TransitionSpecIOS,
  FadeOutToBottomAndroidSpec,
  FadeInFromBottomAndroidSpec,
} from './TransitionSpecs';
import { TransitionPreset } from '../types';

// Standard iOS navigation transition
export const SlideFromRightIOS: TransitionPreset = {
  direction: 'horizontal',
  headerMode: 'float',
  transitionSpec: {
    open: TransitionSpecIOS,
    close: TransitionSpecIOS,
  },
  cardStyleInterpolator: forHorizontalIOS,
  headerStyleInterpolator: forUIKit,
};

// Standard iOS navigation transition for modals
export const ModalSlideFromBottomIOS: TransitionPreset = {
  direction: 'vertical',
  headerMode: 'screen',
  transitionSpec: {
    open: TransitionSpecIOS,
    close: TransitionSpecIOS,
  },
  cardStyleInterpolator: forVerticalIOS,
  headerStyleInterpolator: forFade,
};

// Standard Android navigation transition when opening or closing an Activity
export const FadeFromBottomAndroid: TransitionPreset = {
  direction: 'vertical',
  headerMode: 'screen',
  transitionSpec: {
    open: FadeInFromBottomAndroidSpec,
    close: FadeOutToBottomAndroidSpec,
  },
  cardStyleInterpolator: forFadeFromBottomAndroid,
  headerStyleInterpolator: forFade,
};
