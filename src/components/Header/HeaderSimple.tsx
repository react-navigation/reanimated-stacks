import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';
import HeaderSheet from './HeaderSheet';
import HeaderTitle from './HeaderTitle';
import HeaderBackButton from './HeaderBackButton';

type Props = {
  title: string;
  onGoBack?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderSimple({ title, onGoBack, style }: Props) {
  return (
    <HeaderSheet style={style}>
      <View style={styles.content}>
        {onGoBack ? <HeaderBackButton onPress={onGoBack} /> : null}
        <HeaderTitle style={styles.title}>{title}</HeaderTitle>
        {onGoBack ? <View style={styles.phantom} /> : null}
      </View>
    </HeaderSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    ...Platform.select({
      ios: {
        height: 44,
        marginTop: 20,
      },
      default: {
        height: 56,
        marginTop: StatusBar.currentHeight,
      },
    }),
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    marginHorizontal: 16,
    textAlign: Platform.select({
      ios: 'center',
      default: 'left',
    }),
  },
  phantom: {
    width: 27,
  },
});
