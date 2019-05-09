import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useScreens } from 'react-native-screens';
import Stack, { SceneProps, Route } from './components/Stack';
import Card from './components/Card';
import { forHorizontalIOS } from './CardStyleInterpolator';

type State = {
  routes: Route[];
};

export default class App extends React.Component<{}, State> {
  state = {
    routes: [{ key: '0' }],
  };

  private key = 1;

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
        styleInterpolator={forHorizontalIOS}
      >
        {({ close }: { close: () => void }) => (
          <View style={styles.scene}>
            <Text style={styles.item}>{rest.index}</Text>
            <View style={styles.item}>
              <Button
                title="Add screen"
                onPress={() => {
                  this.setState(state => ({
                    routes: [...state.routes, { key: String(this.key++) }],
                  }));
                }}
              />
            </View>
            {rest.index !== 0 ? (
              <View style={styles.item}>
                <Button title="Go back" onPress={close} />
              </View>
            ) : null}
          </View>
        )}
      </Card>
    );
  };

  render() {
    return <Stack routes={this.state.routes} renderScene={this.renderScene} />;
  }
}

useScreens();

const styles = StyleSheet.create({
  item: {
    margin: 8,
  },
  scene: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
