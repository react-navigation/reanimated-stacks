import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';

export type Route = { key: string };

export type Layout = { width: number; height: number };

export type SceneProps<T> = {
  route: T;
  layout: Layout;
  current: Animated.Value<number>;
  next?: Animated.Value<number>;
};

type ProgressValues = {
  [key: string]: Animated.Value<number>;
};

type Props<T extends Route> = {
  routes: T[];
  renderScene: (props: SceneProps<T>, index: number) => React.ReactNode;
};

type State<T> = {
  routes: T[];
  progress: ProgressValues;
  layout: Layout;
};

export default class Stack<T extends Route> extends React.Component<
  Props<T>,
  State<T>
> {
  static getDerivedStateFromProps(props: Props<Route>, state: State<Route>) {
    if (props.routes === state.routes) {
      return null;
    }

    return {
      progress: props.routes.reduce(
        (acc, curr) => {
          acc[curr.key] = state.progress[curr.key] || new Animated.Value(0);

          return acc;
        },
        {} as ProgressValues
      ),
      routes: props.routes,
    };
  }

  state: State<T> = {
    routes: [],
    progress: {},
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

          return (
            <View
              key={route.key}
              accessibilityElementsHidden={!focused}
              importantForAccessibility={
                focused ? 'auto' : 'no-hide-descendants'
              }
              style={StyleSheet.absoluteFill}
            >
              {renderScene(
                {
                  route,
                  layout,
                  current: progress[route.key],
                  next: self[index + 1]
                    ? progress[self[index + 1].key]
                    : undefined,
                },
                index
              )}
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
