import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import HeaderSheet from './HeaderSheet';
import { Route, Layout } from '../Stack';
import HeaderAnimatedItem, {
  HeaderAnimationPreset,
  InterpolationProps,
} from './HeaderAnimatedItem';

type Scene<T extends Route> = {
  title: string;
  route: T;
  progress: Animated.Node<number>;
};

type Props<T extends Route> = {
  layout: Layout;
  onGoBack: (props: { route: T }) => void;
  preset: HeaderAnimationPreset;
  scenes: Scene<T>[];
  style?: StyleProp<ViewStyle>;
};

const { interpolate, multiply } = Animated;

const FadePreset: HeaderAnimationPreset = {
  styleInterpolator: ({ current, next }: InterpolationProps) => {
    const progress = next
      ? multiply(
          current,
          interpolate(next, {
            inputRange: [0, 1],
            outputRange: [1, 0],
          })
        )
      : current;

    return {
      leftButtonStyle: { opacity: progress },
      titleStyle: { opacity: progress },
    };
  },
};

export default class HeaderAnimated<T extends Route> extends React.Component<
  Props<T>
> {
  static defaultProps = {
    preset: FadePreset,
  };

  render() {
    const { preset, scenes, layout, onGoBack } = this.props;

    return (
      <HeaderSheet>
        <View style={styles.container}>
          {scenes.map((scene, i, self) => {
            const previous = self[i - 1];
            const next = self[i + 1];

            return (
              <HeaderAnimatedItem
                key={scene.route.key}
                preset={preset}
                layout={layout}
                scene={scene}
                previous={previous}
                next={next}
                onGoBack={() => onGoBack({ route: scene.route })}
              />
            );
          })}
        </View>
      </HeaderSheet>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 44 : 56,
    marginTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
});
