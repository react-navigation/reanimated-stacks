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

const { interpolate, add } = Animated;

const UIKitPreset: HeaderAnimationPreset = {
  styleInterpolator: ({ current, next, layout }: InterpolationProps) => {
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
          inputRange: [0.7, 1, 1.3],
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
  },
};

const FadePreset: HeaderAnimationPreset = {
  styleInterpolator: ({ current, next }: InterpolationProps) => {
    const progress = add(current, next ? next : 0);
    const opacity = interpolate(progress, {
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 0],
    });

    return {
      leftButtonStyle: { opacity },
      titleStyle: { opacity },
    };
  },
};

export default class HeaderAnimated<T extends Route> extends React.Component<
  Props<T>
> {
  static defaultProps = {
    preset: Platform.OS === 'ios' ? UIKitPreset : FadePreset,
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
