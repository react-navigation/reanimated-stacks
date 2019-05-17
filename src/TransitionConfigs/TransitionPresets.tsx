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
  transitionSpec: () => TransitionSpecIOS,
  styleInterpolator: forHorizontalIOS,
};

// Standard iOS navigation transition for modals
export const ModalSlideFromBottomIOS: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: () => TransitionSpecIOS,
  styleInterpolator: forVerticalIOS,
};

// Standard Android navigation transition when opening or closing an Activity
export const FadeFromBottomAndroid: TransitionPreset = {
  direction: 'vertical',
  transitionSpec: ({ closing }: { closing: boolean }) =>
    closing ? FadeOutToBottomAndroidSpec : FadeInFromBottomAndroidSpec,
  styleInterpolator: forFadeFromBottomAndroid,
};
