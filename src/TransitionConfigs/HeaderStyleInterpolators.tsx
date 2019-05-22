import Animated from 'react-native-reanimated';
import { HeaderInterpolationProps, HeaderInterpolatedStyle } from '../types';

const { interpolate, add } = Animated;

export function forUIKit({
  current,
  next,
  layout,
}: HeaderInterpolationProps): HeaderInterpolatedStyle {
  /**
   * NOTE: this offset calculation is an approximation that gives us
   * decent results in many cases, but it is ultimately a poor substitute
   * for text measurement. See the comment on title for more information.
   *
   * - 70 is the width of the left button area.
   * - 25 is the width of the left button icon (to account for label offset)
   */
  const buttonAreaSize = 70;
  const buttonIconSize = 25;

  const titleOffset = layout.width / 2 - buttonAreaSize + buttonIconSize;
  const backTitleOffset = layout.width / 2 - buttonAreaSize - buttonIconSize;

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
        inputRange: [0.5, 1, 1.5],
        outputRange: [0, 1, 0],
      }),
      transform: [
        {
          translateX: interpolate(progress, {
            inputRange: [0, 1, 2],
            outputRange: [backTitleOffset, 0, -backTitleOffset],
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
