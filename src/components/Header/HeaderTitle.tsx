import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = React.ComponentProps<typeof Animated.Text> & {
  children: string;
};

export default function HeaderTitle({ style, ...rest }: Props) {
  return <Animated.Text {...rest} style={[styles.title, style]} />;
}

const styles = StyleSheet.create({
  title: Platform.select({
    ios: {
      fontSize: 17,
      fontWeight: '600',
      color: 'rgba(0, 0, 0, .9)',
    },
    android: {
      fontSize: 20,
      fontWeight: '500',
      color: 'rgba(0, 0, 0, .9)',
    },
    default: {
      fontSize: 18,
      fontWeight: '400',
      color: '#3c4043',
    },
  }),
});
