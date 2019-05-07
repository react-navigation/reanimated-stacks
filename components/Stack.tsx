import * as React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';

type Route = { key: string };

type Layout = { width: number };

type Props = {
  routes: Route[];
  renderScene: (props: {
    route: Route;
    layout: Layout;
    animated: boolean;
    position: Animated.Value<number>
    next?: Animated.Value<number>
  }) => React.ReactNode;
};

type State = {
  positions: Animated.Value<number>[];
  layout: Layout;
};

export default class Stack extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    return {
      positions: props.routes.map(
        (_, i) => state.positions[i] || new Animated.Value(state.layout.width)
      ),
    };
  }

  state: State = {
    positions: [],
    layout: { width: 0 },
  };

  private handleLayout = (e: LayoutChangeEvent) => {
    this.setState({ layout: { width: e.nativeEvent.layout.width } });
  };

  render() {
    const { routes, renderScene } = this.props;
    const { layout, positions } = this.state;

    return (
      <View style={styles.container} onLayout={this.handleLayout}>
        {routes.map((route, index) =>
          renderScene({
            route,
            layout,
            animated: index !== 0,
            position: positions[index],
            next: positions[index + 1]
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
