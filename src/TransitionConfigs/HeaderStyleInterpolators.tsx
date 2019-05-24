import Animated from 'react-native-reanimated';
import { HeaderInterpolationProps, HeaderInterpolatedStyle } from '../types';

const { interpolate, add } = Animated;

export function forUIKit({
  positions: { current, next },
  layouts,
}: HeaderInterpolationProps): HeaderInterpolatedStyle {
  const leftSpacing = 27;

  // The title and back button title should cross-fade to each other
  // When screen is fully open, the title should be in center, and back title should be on left
  // When screen is closing, the previous title will animate to back title's position
  // And back title will animate to title's position
  // We achieve this by calculating the offsets needed to translate title to back title's position and vice-versa
  const backTitleOffset = layouts.backTitle
    ? (layouts.screen.width - layouts.backTitle.width) / 2 - leftSpacing
    : undefined;
  const titleLeftOffset = layouts.title
    ? (layouts.screen.width - layouts.title.width) / 2 - leftSpacing
    : undefined;

  // When the current title is animating to right, it is centered in the right half of screen in middle of transition
  // The back title also animates in from this position
  const rightOffset = layouts.screen.width / 4;

  const progress = add(current, next ? next : 0);

  return {
    leftButtonStyle: {
      opacity: interpolate(progress, {
        inputRange: [0.3, 1, 1.5],
        outputRange: [0, 1, 0],
      }),
    },
    backTitleStyle: {
      // Title and back title are a bit different width due to title being bold
      // Adjusting the letterSpacing makes them coincide better
      letterSpacing: backTitleOffset
        ? interpolate(progress, {
            inputRange: [0.3, 1, 2],
            outputRange: [0.35, 0, 0],
          })
        : 0,
      transform: [
        {
          // Avoid translating if we don't have its width
          // It means there's no back title set
          translateX: backTitleOffset
            ? interpolate(progress, {
                inputRange: [0, 1, 2],
                outputRange: [backTitleOffset, 0, -rightOffset],
              })
            : 0,
        },
      ],
    },
    titleStyle: {
      opacity: interpolate(progress, {
        inputRange: [0.4, 1, 1.5],
        outputRange: [0, 1, 0],
      }),
      transform: [
        {
          translateX: titleLeftOffset
            ? interpolate(progress, {
                inputRange: [0.5, 1, 2],
                outputRange: [rightOffset, 0, -titleLeftOffset],
              })
            : 0,
        },
      ],
    },
  };
}

export function forFade({
  positions: { current, next },
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

export function forNoAnimation(): HeaderInterpolatedStyle {
  return {};
}
