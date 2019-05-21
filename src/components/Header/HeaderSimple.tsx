import * as React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  StyleProp,
  ViewStyle,
} from 'react-native';
import HeaderBackButton from './HeaderBackButton';
import HeaderTitle from './HeaderTitle';
import HeaderSheet from './HeaderSheet';

type Props = {
  title: string;
  onGoBack?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderAndroid({ title, onGoBack, style }: Props) {
  return (
    <HeaderSheet style={style}>
      <View style={styles.content}>
        {onGoBack ? <HeaderBackButton onPress={onGoBack} /> : null}
        <HeaderTitle>{title}</HeaderTitle>
      </View>
    </HeaderSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    height: Platform.OS === 'ios' ? 44 : 56,
    marginTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
