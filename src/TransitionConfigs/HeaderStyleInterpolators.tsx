import Animated from 'react-native-reanimated';
import { HeaderInterpolationProps, HeaderInterpolatedStyle } from '../types';

const { interpolate, add } = Animated;

export function forUIKit({
  current,
  next,
  layouts,
}: HeaderInterpolationProps): HeaderInterpolatedStyle {
  const leftSpacing = 27;

  const titleWidth = layouts.title ? layouts.title.width : 0;
  const backTitleWidth = layouts.backTitle ? layouts.backTitle.width : 0;

  // The title and back button title should cross-fade to each other
  // When screen is fully open, the title should be in center, and back title should be on left
  // When screen is closing, the previous title will animate to back title's position
  // And back title will animate to title's position
  // We achieve this by calculating the offsets needed to translate title to back title's position and vice-versa
  const backTitleOffset =
    (layouts.screen.width - backTitleWidth) / 2 - leftSpacing;
  const titleLeftOffset = (layouts.screen.width - titleWidth) / 2 - leftSpacing;

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
      letterSpacing: interpolate(progress, {
        inputRange: [0.3, 1, 2],
        outputRange: [0.35, 0, 0],
      }),
      transform: [
        {
          translateX: interpolate(progress, {
            inputRange: [0, 1, 2],
            outputRange: [backTitleOffset, 0, -rightOffset],
          }),
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
          translateX: interpolate(progress, {
            inputRange: [0.5, 1, 2],
            outputRange: [rightOffset, 0, -titleLeftOffset],
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
