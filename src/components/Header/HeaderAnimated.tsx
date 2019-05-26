import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import HeaderBar from './HeaderBar';
import HeaderSegment from './HeaderSegment';
import { Route, Scene, Layout, HeaderStyleInterpolator } from '../../types';

type Props<T extends Route> = {
  layout: Layout;
  onGoBack: (props: { route: T }) => void;
  scenes: Scene<T>[];
  styleInterpolator: HeaderStyleInterpolator;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderAnimated<T extends Route>({
  scenes,
  layout,
  onGoBack,
  styleInterpolator,
}: Props<T>) {
  return (
    <HeaderBar layout={layout}>
      {scenes.map((scene, i, self) => {
        const previous = self[i - 1];
        const next = self[i + 1];

        return (
          <HeaderSegment
            key={scene.route.key}
            layout={layout}
            scene={scene}
            previous={previous}
            next={next}
            onGoBack={
              previous ? () => onGoBack({ route: scene.route }) : undefined
            }
            styleInterpolator={styleInterpolator}
            style={StyleSheet.absoluteFill}
          />
        );
      })}
    </HeaderBar>
  );
}
