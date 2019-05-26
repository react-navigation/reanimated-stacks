import * as React from 'react';
import { View, StyleSheet, Platform, ViewProps, StatusBar } from 'react-native';
import { Layout } from '../../types';

type Props = ViewProps & {
  children: React.ReactNode;
  layout: Layout;
};

const STATUSBAR_HEIGHT = Platform.select({
  ios: 20,
  default: StatusBar.currentHeight,
});

const getHeaderHeight = (layout: Layout) => {
  const isLandscape = layout.width > layout.height;

  if (Platform.OS === 'ios') {
    // @ts-ignore
    if (isLandscape && !Platform.isPad) {
      return 32;
    } else {
      return 44;
    }
  } else if (Platform.OS === 'android') {
    return 56;
  } else {
    return 64;
  }
};

export default function HeaderBar({ layout, style, children, ...rest }: Props) {
  return (
    <View {...rest} style={[styles.container, style]}>
      <View
        style={{ height: getHeaderHeight(layout), marginTop: STATUSBAR_HEIGHT }}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#A7A7AA',
      },
      default: {
        // https://github.com/necolas/react-native-web/issues/44
        // Material Design
        boxShadow: `0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)`,
      },
    }),
  },
});
