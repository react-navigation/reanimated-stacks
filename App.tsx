import * as React from 'react';
import { Text, Button } from 'react-native';
import Stack, { SceneProps, Route } from './components/Stack';
import Card from './components/Card';

type State = {
  routes: Route[];
};

export default class App extends React.Component<{}, State> {
  state = {
    routes: [{ key: '0' }],
  };

  private renderScene = ({ route, ...rest }: SceneProps) => {
    return (
      <Card
        {...rest}
        key={route.key}
        onRemove={() =>
          this.setState(state => ({
            routes: state.routes.filter(r => r !== route),
          }))
        }
        style={{ alignItems: 'center', justifyContent: 'center' }}
      >
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
