import * as React from 'react';
import { Text, Button } from 'react-native';
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
    focused
  }: {
    route: Route;
    layout: Layout;
    animated: boolean;
    focused: boolean
  }) => {
    return (
      <Card
        key={route.key}
        layout={layout}
        animated={animated}
        focused={focused}
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
