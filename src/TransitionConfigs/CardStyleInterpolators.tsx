import Animated from 'react-native-reanimated';
import { CardInterpolationProps, CardInterpolatedStyle } from '../types';

const { cond, multiply, interpolate } = Animated;

/**
 * Standard iOS-style slide in from the right.
 */
export function forHorizontalIOS({
  positions: { current, next },
  layout,
}: CardInterpolationProps): CardInterpolatedStyle {
  const translateFocused = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [layout.width, 0],
  });
  const translateUnfocused = next
    ? interpolate(next, {
        inputRange: [0, 1],
        outputRange: [0, multiply(layout.width, -0.3)],
      })
    : 0;

  const opacity = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [0, 0.07],
  });

  const shadowOpacity = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return {
    cardStyle: {
      backgroundColor: '#eee',
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
      shadowOpacity,
    },
    overlayStyle: { opacity },
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
export function forVerticalIOS({
  positions: { current },
  layout,
}: CardInterpolationProps): CardInterpolatedStyle {
  const translateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [layout.height, 0],
  });

  return {
    cardStyle: {
      backgroundColor: '#eee',
      transform: [
        // Translation for the animation of the current card
        { translateY },
      ],
    },
  };
}

/**
 * Standard Android-style fade in from the bottom for Android Oreo.
 */
export function forFadeFromBottomAndroid({
  positions: { current },
  layout,
  closing,
}: CardInterpolationProps): CardInterpolatedStyle {
  const translateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [multiply(layout.height, 0.08), 0],
  });

  const opacity = cond(
    closing,
    current,
    interpolate(current, {
      inputRange: [0, 0.5, 0.9, 1],
      outputRange: [0, 0.25, 0.7, 1],
    })
  );

  return {
    cardStyle: {
      opacity,
      transform: [{ translateY }],
    },
  };
}

/**
 * Standard Android-style wipe from the bottom for Android Pie.
 */
export function forWipeFromBottomAndroid({
  positions: { current, next },
  layout,
}: CardInterpolationProps): CardInterpolatedStyle {
  const containerTranslateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [layout.height, 0],
  });
  const cardTranslateYFocused = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [multiply(layout.height, 95.9 / 100, -1), 0],
  });
  const cardTranslateYUnfocused = next
    ? interpolate(next, {
        inputRange: [0, 1],
        outputRange: [0, multiply(layout.height, 2 / 100, -1)],
      })
    : 0;
  const overlayOpacity = interpolate(current, {
    inputRange: [0, 0.36, 1],
    outputRange: [0, 0.1, 0.1],
  });

  return {
    containerStyle: {
      transform: [{ translateY: containerTranslateY }],
    },
    cardStyle: {
      transform: [
        { translateY: cardTranslateYFocused },
        { translateY: cardTranslateYUnfocused },
      ],
    },
    overlayStyle: { opacity: overlayOpacity },
  };
}
