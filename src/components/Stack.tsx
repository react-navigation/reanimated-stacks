import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';

export type Route = { key: string };

export type Layout = { width: number; height: number };

export type SceneProps<T> = {
  focused: boolean;
  stale: boolean;
  index: number;
  route: T;
  layout: Layout;
  current: Animated.Value<number>;
  next?: Animated.Value<number>;
};

type Props<T extends Route> = {
  routes: T[];
  renderScene: (props: SceneProps<T>) => React.ReactNode;
};

type State = {
  progress: Animated.Value<number>[];
  layout: Layout;
};

export default class Stack<T extends Route> extends React.Component<Props<T>, State> {
  static getDerivedStateFromProps(props: Props<Route>, state: State) {
    return {
      progress: props.routes.map(
        (_, i, self) =>
          state.progress[i] || new Animated.Value(i === self.length - 1 ? 0 : 1)
      ),
    };
  }

  state: State = {
    progress: [],
    layout: { width: 0, height: 0 },
  };

  private handleLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout;

    this.setState({ layout: { width, height } });
  };

  render() {
    const { routes, renderScene } = this.props;
    const { layout, progress } = this.state;

    return (
      <View
        style={styles.container}
        onLayout={this.handleLayout}
        pointerEvents={layout.height && layout.width ? 'auto' : 'none'}
      >
        {routes.map((route, index, self) => {
          const focused = index === self.length - 1;

          return renderScene({
            focused,
            stale: index !== self.length - 2 && focused,
            index,
            route,
            layout,
            current: progress[index],
            next: progress[index + 1],
          });
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
