import Animated from 'react-native-reanimated';
import { HeaderInterpolationProps, HeaderInterpolatedStyle } from '../types';

const { interpolate, add } = Animated;

export function forUIKit({
  current,
  next,
  layouts,
}: HeaderInterpolationProps): HeaderInterpolatedStyle {
  const titleOffset =
    (layouts.screen.width - (layouts.title ? layouts.title.width : 0)) / 2 - 28;

  const progress = add(current, next ? next : 0);

  return {
    leftButtonStyle: {
      opacity: interpolate(progress, {
        inputRange: [0, 1, 2],
        outputRange: [0, 1, 0],
      }),
    },
    backTitleStyle: {
      opacity: interpolate(progress, {
        inputRange: [0.5, 1, 2],
        outputRange: [0, 1, 1],
      }),
      transform: [
        {
          translateX: interpolate(progress, {
            inputRange: [0, 1, 2],
            outputRange: [titleOffset, 0, -titleOffset],
          }),
        },
      ],
    },
    titleStyle: {
      opacity: interpolate(progress, {
        inputRange: [0.5, 1, 1.7],
        outputRange: [0, 1, 0],
      }),
      transform: [
        {
          translateX: interpolate(progress, {
            inputRange: [0, 1, 2],
            outputRange: [titleOffset, 0, -titleOffset],
          }),
        },
      ],
    },
  };
}

export function forFade({
  current,
  next,
}: HeaderInterpolationProps): HeaderInterpolatedStyle {
  const progress = add(current, next ? next : 0);
  const opacity = interpolate(progress, {
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    titleStyle: { opacity },
  };
}
