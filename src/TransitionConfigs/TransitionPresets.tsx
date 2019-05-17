import {
  forHorizontalIOS,
  forVerticalIOS,
  forFadeFromBottomAndroid,
} from './StyleInterpolators';
import { TransitionPreset } from '../types';
import {
  TransitionSpecIOS,
  FadeOutToBottomAndroidSpec,
  FadeInFromBottomAndroidSpec,
} from './TransitionSpecs';

// Standard iOS navigation transition
export const SlideFromRightIOS: TransitionPreset = {
  direction: 'horizontal',
  transitionSpec: {
    open: TransitionSpecIOS,
    close: TransitionSpecIOS,
  },
  styleInterpolator: forHorizontalIOS,
};

// Standard iOS navigation transition for modals
export const ModalSlideFromBottomIOS: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: {
    open: TransitionSpecIOS,
    close: TransitionSpecIOS,
  },
  styleInterpolator: forVerticalIOS,
};

// Standard Android navigation transition when opening or closing an Activity
export const FadeFromBottomAndroid: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: {
    open: FadeInFromBottomAndroidSpec,
    close: FadeOutToBottomAndroidSpec
  },
  styleInterpolator: forFadeFromBottomAndroid,
};
