import * as React from 'react';
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';

type Route = { key: string };

type Layout = { width: number };

type Props = {
  routes: Route[];
  renderScene: (props: {
    route: Route;
    layout: Layout;
    animated: boolean;
  }) => React.ReactNode;
};

type State = {
  layout: Layout;
};

export default class Stack extends React.Component<Props, State> {
  state: State = {
    layout: { width: 0 },
  };

  private handleLayout = (e: LayoutChangeEvent) => {
    this.setState({ layout: { width: e.nativeEvent.layout.width } });
  };

  render() {
    const { routes, renderScene } = this.props;
    const { layout } = this.state;

    return (
      <View style={styles.container} onLayout={this.handleLayout}>
        {routes.map((route, index) =>
          renderScene({
            route,
            layout,
            animated: index !== 0,
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
