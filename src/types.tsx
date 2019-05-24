import Animated from 'react-native-reanimated';

export type Route = { key: string };

export type Layout = { width: number; height: number };

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

export type CardInterpolationProps = {
  positions: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
  };
  closing: Animated.Node<0 | 1>;
  layout: {
    width: Animated.Node<number>;
    height: Animated.Node<number>;
  };
};

export type CardInterpolatedStyle = {
  containerStyle?: any;
  cardStyle?: any;
  overlayStyle?: any;
};

export type CardStyleInterpolator = (
  props: CardInterpolationProps
) => CardInterpolatedStyle;

export type HeaderInterpolationProps = {
  positions: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
  };
  layouts: {
    screen: Layout;
    title?: Layout;
    backTitle?: Layout;
  };
};

export type HeaderInterpolatedStyle = {
  backTitleStyle?: any;
  leftButtonStyle?: any;
  titleStyle?: any;
};

export type HeaderStyleInterpolator = (
  props: HeaderInterpolationProps
) => HeaderInterpolatedStyle;

export type TransitionPreset = {
  direction: 'horizontal' | 'vertical';
  headerMode: 'float' | 'screen';
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  cardStyleInterpolator: CardStyleInterpolator;
  headerStyleInterpolator: HeaderStyleInterpolator;
};
