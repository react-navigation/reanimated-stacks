import Animated from 'react-native-reanimated';

export type InterpolationProps = {
  current: Animated.Node<number>;
  next?: Animated.Node<number>;
  closing: Animated.Node<0 | 1>;
  layout: {
    width: Animated.Node<number>;
    height: Animated.Node<number>;
  };
};

export type InterpolatedStyle = {
  cardStyle?: any;
  overlayStyle?: any;
};

export type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
  restSpeedThreshold: number;
  restDisplacementThreshold: number;
  overshootClamping: boolean;
};

export type TimingConfig = {
  duration: number;
  easing: Animated.EasingFunction;
};

export type TransitionSpec =
  | { timing: 'spring'; config: SpringConfig }
  | { timing: 'timing'; config: TimingConfig };

export type TransitionPreset = {
  direction: 'horizontal' | 'vertical';
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  styleInterpolator: (props: InterpolationProps) => InterpolatedStyle;
};
