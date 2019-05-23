import * as React from 'react';
import {
  I18nManager,
  Image,
  View,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
  MaskedViewIOS,
} from 'react-native';
import Animated from 'react-native-reanimated';
import TouchableItem from '../TouchableItem';
import { Layout } from '../../types';

type Props = {
  disabled?: boolean;
  onPress: () => void;
  pressColorAndroid?: string;
  backImage?: (props: { tintColor: string; title?: string }) => React.ReactNode;
  tintColor: string;
  title?: string;
  truncatedTitle?: string;
  backTitleVisible?: boolean;
  allowFontScaling?: boolean;
  titleStyle?: React.ComponentProps<typeof Animated.Text>['style'];
  onTitleLayout?: (e: LayoutChangeEvent) => void;
  layout?: Layout;
};

type State = {
  titleWidth?: number;
};

class HeaderBackButton extends React.Component<Props, State> {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
      web: '#5f6368',
    }),
    backTitleVisible: Platform.OS === 'ios',
    truncatedTitle: 'Back',
  };

  state: State = {};

  private handleTitleLayout = (e: LayoutChangeEvent) => {
    const { onTitleLayout } = this.props;

    onTitleLayout && onTitleLayout(e);

    this.setState({
      titleWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  private renderBackImage() {
    const { backImage, backTitleVisible, tintColor } = this.props;

    let title = this.getTitleText();

    if (backImage) {
      return backImage({ tintColor, title });
    } else {
      return (
        <Image
          style={[
            styles.icon,
            !!backTitleVisible && styles.iconWithTitle,
            !!tintColor && { tintColor },
          ]}
          source={require('../../assets/back-icon.png')}
          fadeDuration={0}
        />
      );
    }
  }

  private getTitleText = () => {
    const { layout, title, truncatedTitle } = this.props;

    let { titleWidth } = this.state;

    if (title == undefined) {
      return undefined;
    } else if (!title) {
      return truncatedTitle;
    } else if (titleWidth && layout && titleWidth > layout.width / 3) {
      return truncatedTitle;
    } else {
      return title;
    }
  };

  private maybeRenderTitle() {
    const {
      allowFontScaling,
      backTitleVisible,
      backImage,
      titleStyle,
      tintColor,
      layout,
    } = this.props;

    let backTitleText = this.getTitleText();

    if (!backTitleVisible || backTitleText === undefined) {
      return null;
    }

    const title = (
      <Animated.Text
        accessible={false}
        onLayout={this.handleTitleLayout}
        style={[
          styles.title,
          layout ? { marginRight: layout.width / 2 } : null,
          tintColor ? { color: tintColor } : null,
          titleStyle,
        ]}
        numberOfLines={1}
        allowFontScaling={!!allowFontScaling}
      >
        {this.getTitleText()}
      </Animated.Text>
    );

    if (backImage) {
      return title;
    }

    return (
      <MaskedViewIOS
        maskElement={
          <View style={styles.iconMaskContainer}>
            <Image
              source={require('../../assets/back-icon-mask.png')}
              style={styles.iconMask}
            />
            <View style={styles.iconMaskFillerRect} />
          </View>
        }
      >
        {title}
      </MaskedViewIOS>
    );
  }

  render() {
    const { onPress, pressColorAndroid, title, disabled } = this.props;

    return (
      <TouchableItem
        disabled={disabled}
        accessible
        accessibilityRole="button"
        accessibilityComponentType="button"
        accessibilityLabel={title ? `${title}, back` : 'Go back'}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={disabled ? undefined : onPress}
        pressColor={pressColorAndroid}
        style={[styles.container, disabled && styles.disabled]}
        borderless
      >
        <React.Fragment>
          {this.renderBackImage()}
          {this.maybeRenderTitle()}
        </React.Fragment>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 17,
  },
  icon: Platform.select({
    ios: {
      height: 21,
      width: 13,
      marginLeft: 8,
      marginRight: 22,
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    default: {
      height: 24,
      width: 24,
      marginVertical: 6,
      marginHorizontal: 14,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  }),
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginRight: 6,
        }
      : {},
  iconMaskContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconMaskFillerRect: {
    flex: 1,
    backgroundColor: '#000',
  },
  iconMask: {
    height: 21,
    width: 13,
    marginLeft: -14.5,
    marginVertical: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
});

export default HeaderBackButton;
