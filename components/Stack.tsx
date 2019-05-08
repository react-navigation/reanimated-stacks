import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';

type Route = { key: string };

type Layout = { width: number; height: number };

type Props = {
  routes: Route[];
  renderScene: (props: {
    route: Route;
    layout: Layout;
    animated: boolean;
    current: Animated.Value<number>;
    next?: Animated.Value<number>;
  }) => React.ReactNode;
};

type State = {
  progress: Animated.Value<number>[];
  layout: Layout;
};

export default class Stack extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      progress: props.routes.map(
        (_, i) => state.progress[i] || new Animated.Value(1)
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
      <View style={styles.container} onLayout={this.handleLayout}>
        {routes.map((route, index) =>
          renderScene({
            route,
            layout,
            animated: index !== 0,
            current: progress[index],
            next: progress[index + 1],
          })
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
