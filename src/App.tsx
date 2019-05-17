import * as React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useScreens } from 'react-native-screens';
import Stack, { SceneProps, Route } from './components/Stack';
import Card from './components/Card';
import { SlideFromRightIOS } from './TransitionConfigs/TransitionPresets';

type CustomRoute = Route & { initial?: boolean };

type State = {
  routes: CustomRoute[];
};

export default class App extends React.Component<{}, State> {
  state = {
    routes: [{ key: '0', initial: true }, { key: '1', initial: true }],
  };

  private key = 2;

  private renderScene = (
    { route, ...rest }: SceneProps<CustomRoute>,
    index: number
  ) => {
    return (
      <Card
        {...rest}
        key={route.key}
        onClose={() =>
          this.setState(state => ({
            routes: state.routes.filter(r => r !== route),
          }))
        }
        gesturesEnabled={index !== 0}
        animationsEnabled={!route.initial}
        {...SlideFromRightIOS}
      >
        {({ close }: { close: () => void }) => (
          <View style={styles.scene}>
            <Text style={styles.item}>{index}</Text>
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
            {index !== 0 ? (
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

useScreens(true);

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
