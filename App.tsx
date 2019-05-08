import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
        onClose={() =>
          this.setState(state => ({
            routes: state.routes.filter(r => r !== route),
          }))
        }
        style={styles.scene}
      >
        {({ close }: { close: () => void }) => (
          <React.Fragment>
            <Text style={styles.item}>{route.key}</Text>
            <View style={styles.item}>
              <Button
                title="Add screen"
                onPress={() => {
                  this.setState(state => ({
                    routes: [
                      ...state.routes,
                      { key: String(state.routes.length) },
                    ],
                  }));
                }}
              />
            </View>
            <View style={styles.item}>
              <Button title="Go back" onPress={close} />
            </View>
          </React.Fragment>
        )}
      </Card>
    );
  };

  render() {
    return <Stack routes={this.state.routes} renderScene={this.renderScene} />;
  }
}

const styles = StyleSheet.create({
  item: {
    margin: 8,
  },
  scene: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
