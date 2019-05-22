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
import HeaderAnimatedItem from './HeaderAnimatedItem';
import { Route, Layout, HeaderStyleInterpolator } from '../../types';

type Scene<T extends Route> = {
  title: string;
  route: T;
  progress: Animated.Node<number>;
};

type Props<T extends Route> = {
  layout: Layout;
  onGoBack: (props: { route: T }) => void;
  scenes: Scene<T>[];
  styleInterpolator: HeaderStyleInterpolator;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderAnimated<T extends Route>({
  scenes,
  layout,
  onGoBack,
  styleInterpolator,
}: Props<T>) {
  return (
    <HeaderSheet>
      <View style={styles.container}>
        {scenes.map((scene, i, self) => {
          const previous = self[i - 1];
          const next = self[i + 1];

          return (
            <HeaderAnimatedItem
              key={scene.route.key}
              layout={layout}
              scene={scene}
              previous={previous}
              next={next}
              onGoBack={() => onGoBack({ route: scene.route })}
              styleInterpolator={styleInterpolator}
            />
          );
        })}
      </View>
    </HeaderSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 44 : 56,
    marginTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
  },
});
