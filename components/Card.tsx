import * as React from 'react';
import { StyleSheet, BackHandler, StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State as GestureState,
} from 'react-native-gesture-handler';

type Props = {
  next?: Animated.Value<number>;
  position: Animated.Value<number>;
  layout: { width: number };
  animated: boolean;
  onRemove: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

type Binary = 0 | 1;

const TRUE = 1;
const FALSE = 0;
const NOOP = 0;
const UNSET = -1;

const SWIPE_VELOCITY_THRESHOLD_DEFAULT = 500;
const SWIPE_DISTANCE_THRESHOLD_DEFAULT = 60;

const SWIPE_DISTANCE_MINIMUM = 5;

const {
  cond,
  eq,
  neq,
  divide,
  set,
  and,
  or,
  greaterThan,
  lessThan,
  add,
  max,
  abs,
  block,
  stopClock,
  startClock,
  clockRunning,
  onChange,
  Value,
  Clock,
  call,
  spring,
  interpolate,
} = Animated;

const SPRING_CONFIG = {
  damping: 30,
  mass: 1,
  stiffness: 200,
  overshootClamping: true,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

export default class Card extends React.Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  private handleBack = () => {
    if (this.isVisibleValue) {
      this.nextIsVisible.setValue(FALSE);

      return true;
    } else {
      return false;
    }
  };

  componentDidUpdate(prevProps: Props) {
    const { layout, animated } = this.props;
    const { width } = layout;

    if (width !== prevProps.layout.width) {
      this.layoutWidth.setValue(width);
      this.props.position.setValue(width);
    }

    if (animated !== prevProps.animated) {
      this.isAnimated.setValue(animated ? TRUE : FALSE);
    }
  }

  private isVisibleValue = TRUE;

  private isAnimated = new Value<Binary>(this.props.animated ? TRUE : FALSE);
  private isVisible = new Value<Binary>(TRUE);
  private nextIsVisible = new Value<Binary | -1>(UNSET);

  private clock = new Clock();
  private layoutWidth = new Value(this.props.layout.width);

  private gestureX = new Value(0);
  private offsetX = new Value(0);
  private velocityX = new Value(0);
  private gestureState = new Value(0);

  private isSwiping = new Value(FALSE);
  private isSwipeGesture = new Value(FALSE);

  private transitionTo = (isVisible: Binary | Animated.Node<number>) => {
    const toValue = new Value(0);
    const frameTime = new Value(0);

    const state = {
      position: this.props.position,
      time: new Value(0),
      finished: new Value(FALSE),
    };

    return block([
      cond(clockRunning(this.clock), NOOP, [
        // Animation wasn't running before
        // Set the initial values and start the clock
        set(toValue, cond(isVisible, 0, this.layoutWidth)),
        set(frameTime, 0),
        set(state.time, 0),
        set(state.finished, FALSE),
        set(this.isVisible, isVisible),
        startClock(this.clock),
      ]),
      spring(
        this.clock,
        { ...state, velocity: this.velocityX },
        { ...SPRING_CONFIG, toValue }
      ),
      cond(state.finished, [
        // Reset values
        set(this.isSwipeGesture, FALSE),
        set(this.gestureX, 0),
        set(this.velocityX, 0),
        // When the animation finishes, stop the clock
        stopClock(this.clock),
        call([this.isVisible], ([value]: ReadonlyArray<Binary>) => {
          const isVisible = Boolean(value);

          if (!isVisible) {
            this.props.onRemove();
          }
        }),
      ]),
    ]);
  };

  private translateX = block([
    onChange(
      this.isVisible,
      call([this.isVisible], ([value]) => {
        this.isVisibleValue = value;
      })
    ),
    onChange(
      this.nextIsVisible,
      cond(neq(this.nextIsVisible, UNSET), [
        // Stop any running animations
        cond(clockRunning(this.clock), stopClock(this.clock)),
        // Update the index to trigger the transition
        set(this.isVisible, this.nextIsVisible),
        set(this.nextIsVisible, UNSET),
      ])
    ),
    cond(
      eq(this.gestureState, GestureState.ACTIVE),
      [
        cond(this.isSwiping, NOOP, [
          // We weren't dragging before, set it to true
          set(this.isSwiping, TRUE),
          set(this.isSwipeGesture, TRUE),
          // Also update the drag offset to the last position
          set(this.offsetX, this.props.position),
        ]),
        // Update position with next offset + gesture distance
        set(this.props.position, max(add(this.offsetX, this.gestureX), 0)),
        // Stop animations while we're dragging
        stopClock(this.clock),
      ],
      [
        set(this.isSwiping, FALSE),
        cond(
          this.isAnimated,
          this.transitionTo(
            cond(
              or(
                and(
                  greaterThan(abs(this.gestureX), SWIPE_DISTANCE_MINIMUM),
                  greaterThan(
                    abs(this.velocityX),
                    SWIPE_VELOCITY_THRESHOLD_DEFAULT
                  )
                ),
                cond(
                  greaterThan(
                    abs(this.gestureX),
                    SWIPE_DISTANCE_THRESHOLD_DEFAULT
                  ),
                  TRUE,
                  FALSE
                )
              ),
              cond(
                lessThan(
                  cond(eq(this.velocityX, 0), this.gestureX, this.velocityX),
                  0
                ),
                TRUE,
                FALSE
              ),
              this.isVisible
            )
          ),
          set(this.props.position, 0)
        ),
      ]
    ),
    this.props.position,
  ]);

  private handleGestureEvent = Animated.event([
    {
      nativeEvent: {
        translationX: this.gestureX,
        velocityX: this.velocityX,
        state: this.gestureState,
      },
    },
  ]);

  render() {
    const { layout, animated, position, next, style, children } = this.props;

    const progress = cond(
      eq(this.layoutWidth, 0),
      0,
      divide(position, this.layoutWidth)
    );

    const translateX = next
      ? cond(
          eq(this.layoutWidth, 0),
          1,
          interpolate(next, {
            inputRange: [0, layout.width],
            outputRange: [-80, 0],
          })
        )
      : 0;

    const opacity = interpolate(progress, {
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            // We don't want the user to be able to press through the overlay when the card is open
            // One approach is to adjust the pointerEvents based on the progress
            // But we can also send the overlay behind the screen, which works, and is much less code
            zIndex: cond(greaterThan(progress, 0), 0, -1),
            transform: [{ translateX }],
          },
        ]}
      >
        <Animated.View style={[styles.overlay, { opacity }]} />
        <PanGestureHandler
          enabled={layout.width !== 0 && animated}
          onGestureEvent={this.handleGestureEvent}
          onHandlerStateChange={this.handleGestureEvent}
        >
          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateX: this.translateX }] },
              style,
            ]}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    ...StyleSheet.absoluteFillObject,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 5,
    shadowColor: '#000',
    backgroundColor: 'white',
    elevation: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
