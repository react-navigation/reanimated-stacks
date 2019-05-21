import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import HeaderTitle from './HeaderTitle';
import { Route, Layout } from '../Stack';
import HeaderBackButton from './HeaderBackButton';
import memoize from '../../utils/memoize';

export type InterpolationProps = {
  current: Animated.Node<number>;
  next?: Animated.Node<number>;
  layout: Layout;
};

export type StyleInterpolator = (
  props: InterpolationProps
) => {
  leftButtonStyle: any;
  titleStyle: any;
};

export type HeaderAnimationPreset = {
  styleInterpolator: StyleInterpolator;
};

export type Scene<T extends Route> = {
  title: string;
  route: T;
  progress: Animated.Node<number>;
};

type Props<T extends Route> = {
  layout: Layout;
  onGoBack: () => void;
  preset: HeaderAnimationPreset;
  scene: Scene<T>;
  previous?: Scene<T>;
  next?: Scene<T>;
  style?: StyleProp<ViewStyle>;
};

export default class HeaderAnimatedItem<
  T extends Route
> extends React.Component<Props<T>> {
  private getInterpolatedStyle = memoize(
    (
      styleInterpolator: StyleInterpolator,
      layout: Layout,
      current: Animated.Node<number>,
      next?: Animated.Node<number>
    ) => styleInterpolator({ current, next, layout })
  );

  render() {
    const {
      scene,
      previous,
      next,
      preset,
      layout,
      onGoBack,
      style,
    } = this.props;

    const { titleStyle, leftButtonStyle } = this.getInterpolatedStyle(
      preset.styleInterpolator,
      layout,
      scene.progress,
      next ? next.progress : undefined
    );

    return (
      <View style={[styles.content, style]}>
        {previous ? (
          <Animated.View style={[styles.left, leftButtonStyle]}>
            <HeaderBackButton onPress={onGoBack} title={previous.title} />
          </Animated.View>
        ) : null}
        <HeaderTitle style={[previous ? styles.title : null, titleStyle]}>
          {scene.title}
        </HeaderTitle>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  title: {
    marginHorizontal: 48,
  },
});
