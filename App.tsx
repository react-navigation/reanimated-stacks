import * as React from 'react';
import { Text, Button } from 'react-native';
import Animated from 'react-native-reanimated';
import Stack from './components/Stack';
import Card from './components/Card';

type Route = { key: string };

type Layout = { width: number };

type State = {
  routes: Route[];
};

export default class App extends React.Component<{}, State> {
  state = {
    routes: [{ key: '0' }],
  };

  private renderScene = ({
    route,
    layout,
    animated,
    current,
    next,
  }: {
    route: Route;
    layout: Layout;
    animated: boolean;
    current: Animated.Value<number>
    next?: Animated.Value<number>
  }) => {
    return (
      <Card
        key={route.key}
        layout={layout}
        animated={animated}
        current={current}
        next={next}
        direction="vertical"
        onRemove={() =>
          this.setState(state => ({
            routes: state.routes.filter(r => r !== route),
          }))
        }
        style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>{route.key}</Text>
        <Button
          title="Add screen"
          onPress={() => {
            this.setState(state => ({
              routes: [...state.routes, { key: String(state.routes.length) }],
            }));
          }}
        />
      </Card>
    );
  };

  render() {
    return <Stack routes={this.state.routes} renderScene={this.renderScene} />;
  }
}
