import * as React from 'react';
import {
  I18nManager,
  Image,
  View,
  Platform,
  StyleSheet,
  LayoutChangeEvent,
  Text,
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
  titleStyle?: React.ComponentProps<typeof Text>['style'];
  layout?: Layout;
};

type State = {
  initialTitleWidth?: number;
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

  private handleTextLayout = (e: LayoutChangeEvent) => {
    if (this.state.initialTitleWidth) {
      return;
    }

    this.setState({
      initialTitleWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
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

    let { initialTitleWidth } = this.state;

    if (title == undefined) {
      return undefined;
    } else if (!title) {
      return truncatedTitle;
    } else if (
      initialTitleWidth &&
      layout &&
      initialTitleWidth > layout.width / 3
    ) {
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
    } = this.props;

    let backTitleText = this.getTitleText();

    if (!backTitleVisible || backTitleText === undefined) {
      return null;
    }

    const title = (
      <Animated.Text
        accessible={false}
        onLayout={this.handleTextLayout}
        style={[
          styles.title,
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

    let button = (
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

    if (Platform.OS === 'ios') {
      return button;
    } else {
      return <View style={styles.androidButtonWrapper}>{button}</View>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  androidButtonWrapper: {
    height: 36,
    width: 36,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    letterSpacing: 0.25,
  },
  icon: Platform.select({
    ios: {
      backgroundColor: 'transparent',
      height: 21,
      width: 13,
      marginLeft: 9,
      marginRight: 22,
      marginVertical: 12,
      resizeMode: 'contain',
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
    default: {
      height: 21,
      width: 21,
      resizeMode: 'contain',
      backgroundColor: 'transparent',
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
