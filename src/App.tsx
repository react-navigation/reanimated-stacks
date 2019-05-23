import * as React from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import Stack, { SceneProps } from './components/Stack';
import { Route } from './types';
import {
  SlideFromRightIOS,
  FadeFromBottomAndroid,
} from './TransitionConfigs/TransitionPresets';

type State = {
  routes: Route[];
  initialRoutes: string[];
  closingRoutes: string[];
};

export default class App extends React.Component<{}, State> {
  state: State = {
    routes: [{ key: '0' }, { key: '1' }],
    initialRoutes: ['0', '1'],
    closingRoutes: [],
  };

  private key = 2;

  private renderScene = ({ route, index }: SceneProps<Route>) => {
    return (
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
            <Button
              title="Go back"
              onPress={() =>
                this.setState(state => ({
                  closingRoutes: [...state.closingRoutes, route.key],
                }))
              }
            />
          </View>
        ) : null}
      </View>
    );
  };

  render() {
    return (
      <Stack
        routes={this.state.routes}
        initialRoutes={this.state.initialRoutes}
        closingRoutes={this.state.closingRoutes}
        onGoBack={({ route }) =>
          this.setState(state => ({
            closingRoutes: [...state.closingRoutes, route.key],
          }))
        }
        onCloseRoute={({ route }) =>
          this.setState(state => ({
            routes: state.routes.filter(r => r !== route),
            closingRoutes: state.closingRoutes.filter(key => key !== route.key),
            initialRoutes: state.initialRoutes.filter(key => key !== route.key),
          }))
        }
        renderScene={this.renderScene}
        {...Platform.select({
          ios: SlideFromRightIOS,
          default: FadeFromBottomAndroid,
        })}
      />
    );
  }
}

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
