import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  children: string;
  style?: React.ComponentProps<typeof Animated.Text>['style'];
};

export default function HeaderTitle({ children, style }: Props) {
  return (
    <Animated.Text style={[styles.title, style]}>{children}</Animated.Text>
  );
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    marginHorizontal: 12,
    ...Platform.select({
      ios: {
        textAlign: 'center',
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
  },
});
