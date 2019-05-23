import * as React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Animated from 'react-native-reanimated';
import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';
import memoize from '../../utils/memoize';
import { Route, Layout, HeaderStyleInterpolator } from '../../types';

export type Scene<T extends Route> = {
  title: string;
  route: T;
  progress: Animated.Node<number>;
};

type Props<T extends Route> = {
  layout: Layout;
  onGoBack: () => void;
  scene: Scene<T>;
  previous?: Scene<T>;
  next?: Scene<T>;
  styleInterpolator: HeaderStyleInterpolator;
  style?: StyleProp<ViewStyle>;
};

type State = {
  titleLayout?: Layout;
  backTitleLayout?: Layout;
};

export default class HeaderAnimatedItem<
  T extends Route
> extends React.Component<Props<T>, State> {
  state: State = {};

  private getInterpolatedStyle = memoize(
    (
      styleInterpolator: HeaderStyleInterpolator,
      layout: Layout,
      current: Animated.Node<number>,
      next?: Animated.Node<number>,
      titleLayout?: Layout,
      backTitleLayout?: Layout
    ) =>
      styleInterpolator({
        current,
        next,
        layouts: {
          screen: layout,
          title: titleLayout,
          backTitle: backTitleLayout,
        },
      })
  );

  private handleTitleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({ titleLayout: { height, width } });
  };

  private handleBackTitleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({ backTitleLayout: { height, width } });
  };

  render() {
    const {
      scene,
      previous,
      next,
      layout,
      onGoBack,
      styleInterpolator,
      style,
    } = this.props;

    const { backTitleLayout, titleLayout } = this.state;

    const {
      titleStyle,
      leftButtonStyle,
      backTitleStyle,
    } = this.getInterpolatedStyle(
      styleInterpolator,
      layout,
      scene.progress,
      next ? next.progress : undefined,
      titleLayout,
      backTitleLayout
    );

    return (
      <View style={[styles.content, style]}>
        {previous ? (
          <Animated.View style={[styles.left, leftButtonStyle]}>
            <HeaderBackButton
              onPress={onGoBack}
              title={previous.title}
              titleStyle={backTitleStyle}
              onTitleLayout={this.handleBackTitleLayout}
              layout={layout}
            />
          </Animated.View>
        ) : null}
        <HeaderTitle onLayout={this.handleTitleLayout} style={titleStyle}>
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
    justifyContent: 'center',
  },
  left: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
