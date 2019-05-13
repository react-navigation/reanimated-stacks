import Animated from 'react-native-reanimated';

export type InterpolatorProps = {
  current: Animated.Node<number>;
  next?: Animated.Node<number>;
  layout: { width: number; height: number };
  closing: boolean;
};

export type InterpolatedStyle = {
  cardStyle?: any;
  overlayStyle?: any;
};

const { interpolate } = Animated;

/**
 * Standard iOS-style slide in from the right.
 */
export function forHorizontalIOS({
  current,
  next,
  layout,
}: InterpolatorProps): InterpolatedStyle {
  const translateFocused = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [layout.width, 0],
  });
  const translateUnfocused = next
    ? interpolate(next, {
        inputRange: [0, 1],
        outputRange: [0, layout.width * -0.3],
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
      transform: [
        // Translation for the animation of the current card
        { translateX: translateFocused },
        // Translation for the animation of the card on top of this
        { translateX: translateUnfocused },
      ],
      shadowOpacity,
    },
    overlayStyle: {
      opacity,
    },
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
export function forVerticalIOS({
  current,
  layout,
}: InterpolatorProps): InterpolatedStyle {
  const translateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [layout.height, 0],
  });

  return {
    cardStyle: {
      transform: [
        // Translation for the animation of the current card
        { translateY },
      ],
    },
  };
}

/**
 * Standard Android-style fade in from the bottom.
 */
export function forFadeFromBottomAndroid({
  current,
  layout,
  closing,
}: InterpolatorProps): InterpolatedStyle {
  const translateY = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [layout.height * 0.08, 0],
  });

  const opacity = interpolate(
    current,
    closing
      ? {
          inputRange: [0, 1],
          outputRange: [0, 1],
        }
      : {
          inputRange: [0, 0.5, 0.9, 1],
          outputRange: [0, 0.25, 0.7, 1],
        }
  );

  return {
    cardStyle: {
      opacity,
      transform: [{ translateY }],
    },
  };
}

/**
 * Simple fadeIn and fadeOut
 */
export function forFade({ current }: InterpolatorProps): InterpolatedStyle {
  const opacity = interpolate(current, {
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return {
    cardStyle: {
      opacity,
    },
  };
}

export function forNoAnimation(): InterpolatedStyle {
  return {};
}
