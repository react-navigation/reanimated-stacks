import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  PanGestureHandler,
  State as GestureState,
} from 'react-native-gesture-handler';
import {
  TransitionSpec,
  CardStyleInterpolator,
} from '../types';
import memoize from '../utils/memoize';

type Props = {
  closing?: boolean;
  next?: Animated.Node<number>;
  current: Animated.Value<number>;
  layout: { width: number; height: number };
  direction: 'horizontal' | 'vertical';
  onOpen?: () => void;
  onClose?: () => void;
  children: React.ReactNode;
  animationsEnabled: boolean;
  gesturesEnabled: boolean;
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  styleInterpolator: CardStyleInterpolator;
};

type Binary = 0 | 1;

const TRUE = 1;
const FALSE = 0;
const NOOP = 0;
const UNSET = -1;

const DIRECTION_VERTICAL = -1;
const DIRECTION_HORIZONTAL = 1;

const SWIPE_VELOCITY_THRESHOLD_DEFAULT = 500;
const SWIPE_DISTANCE_THRESHOLD_DEFAULT = 60;

const SWIPE_DISTANCE_MINIMUM = 5;

const {
  cond,
  eq,
  neq,
  set,
  and,
  or,
  greaterThan,
  lessThan,
  abs,
  add,
  max,
  block,
  stopClock,
  startClock,
  clockRunning,
  onChange,
  Value,
  Clock,
  call,
  spring,
  timing,
  interpolate,
} = Animated;

export default class Card extends React.Component<Props> {
  static defaultProps = {
    animationsEnabled: true,
    gesturesEnabled: true,
  };

  componentDidUpdate(prevProps: Props) {
    const { layout, direction, closing, animationsEnabled } = this.props;
    const { width, height } = layout;

    if (
      width !== prevProps.layout.width ||
      height !== prevProps.layout.height
    ) {
      this.layout.width.setValue(width);
      this.layout.height.setValue(height);

      this.position.setValue(
        animationsEnabled
          ? direction === 'vertical'
            ? layout.height
            : layout.width
          : 0
      );
    }

    if (direction !== prevProps.direction) {
      this.direction.setValue(
        direction === 'vertical' ? DIRECTION_VERTICAL : DIRECTION_HORIZONTAL
      );
    }

    if (closing !== prevProps.closing) {
      this.isClosing.setValue(closing ? TRUE : FALSE);
    }
  }

  private isVisible = new Value<Binary>(TRUE);
  private nextIsVisible = new Value<Binary | -1>(UNSET);

  private isClosing = new Value<Binary>(FALSE);

  private clock = new Clock();

  private direction = new Value(
    this.props.direction === 'vertical'
      ? DIRECTION_VERTICAL
      : DIRECTION_HORIZONTAL
  );

  private layout = {
    width: new Value(this.props.layout.width),
    height: new Value(this.props.layout.height),
  };

  private distance = cond(
    eq(this.direction, DIRECTION_VERTICAL),
    this.layout.height,
    this.layout.width
  );

  private position = new Value(
    this.props.animationsEnabled
      ? this.props.direction === 'vertical'
        ? this.props.layout.height
        : this.props.layout.width
      : 0
  );

  private gesture = new Value(0);
  private offset = new Value(0);
  private velocity = new Value(0);

  private gestureState = new Value(0);

  private isSwiping = new Value(FALSE);
  private isSwipeGesture = new Value(FALSE);

  private toValue = new Value(0);
  private frameTime = new Value(0);

  private transitionState = {
    position: this.position,
    time: new Value(0),
    finished: new Value(FALSE),
  };

  private runTransition = (isVisible: Binary | Animated.Node<number>) => {
    const { open: openingSpec, close: closingSpec } = this.props.transitionSpec;

    const toValue = cond(isVisible, 0, this.distance);

    return cond(eq(this.position, toValue), NOOP, [
      cond(clockRunning(this.clock), NOOP, [
        // Animation wasn't running before
        // Set the initial values and start the clock
        set(this.toValue, toValue),
        set(this.frameTime, 0),
        set(this.transitionState.time, 0),
        set(this.transitionState.finished, FALSE),
        set(this.isVisible, isVisible),
        startClock(this.clock),
      ]),
      cond(
        eq(toValue, 0),
        openingSpec.timing === 'spring'
          ? spring(
              this.clock,
              { ...this.transitionState, velocity: this.velocity },
              { ...openingSpec.config, toValue: this.toValue }
            )
          : timing(
              this.clock,
              { ...this.transitionState, frameTime: this.frameTime },
              { ...openingSpec.config, toValue: this.toValue }
            ),
        closingSpec.timing === 'spring'
          ? spring(
              this.clock,
              { ...this.transitionState, velocity: this.velocity },
              { ...closingSpec.config, toValue: this.toValue }
            )
          : timing(
              this.clock,
              { ...this.transitionState, frameTime: this.frameTime },
              { ...closingSpec.config, toValue: this.toValue }
            )
      ),
      cond(this.transitionState.finished, [
        // Reset values
        set(this.isSwipeGesture, FALSE),
        set(this.gesture, 0),
        set(this.velocity, 0),
        // When the animation finishes, stop the clock
        stopClock(this.clock),
        call([this.isVisible], ([value]: ReadonlyArray<Binary>) => {
          const isOpen = Boolean(value);
          const { onOpen, onClose } = this.props;

          if (isOpen) {
            onOpen && onOpen();
          } else {
            onClose && onClose();
          }
        }),
      ]),
    ]);
  };

  private translate = block([
    onChange(
      this.isClosing,
      cond(
        this.isClosing,
        set(this.nextIsVisible, FALSE),
        set(this.nextIsVisible, TRUE)
      )
    ),
    onChange(
      this.nextIsVisible,
      cond(neq(this.nextIsVisible, UNSET), [
        // Stop any running animations
        cond(clockRunning(this.clock), stopClock(this.clock)),
        set(this.gesture, 0),
        // Update the index to trigger the transition
        set(this.isVisible, this.nextIsVisible),
        set(this.nextIsVisible, UNSET),
      ])
    ),
    // Synchronize the translation with the animated value representing the progress
    set(
      this.props.current,
      cond(
        or(eq(this.layout.width, 0), eq(this.layout.height, 0)),
        this.isVisible,
        interpolate(this.position, {
          inputRange: [0, this.distance],
          outputRange: [1, 0],
        })
      )
    ),
    cond(
      eq(this.gestureState, GestureState.ACTIVE),
      [
        cond(this.isSwiping, NOOP, [
          // We weren't dragging before, set it to true
          set(this.isSwiping, TRUE),
          set(this.isSwipeGesture, TRUE),
          // Also update the drag offset to the last position
          set(this.offset, this.position),
        ]),
        // Update position with next offset + gesture distance
        set(this.position, max(add(this.offset, this.gesture), 0)),
        // Stop animations while we're dragging
        stopClock(this.clock),
      ],
      [
        set(this.isSwiping, FALSE),
        this.runTransition(
          cond(
            or(
              and(
                greaterThan(abs(this.gesture), SWIPE_DISTANCE_MINIMUM),
                greaterThan(
                  abs(this.velocity),
                  SWIPE_VELOCITY_THRESHOLD_DEFAULT
                )
              ),
              cond(
                greaterThan(
                  abs(this.gesture),
                  SWIPE_DISTANCE_THRESHOLD_DEFAULT
                ),
                TRUE,
                FALSE
              )
            ),
            cond(
              lessThan(
                cond(eq(this.velocity, 0), this.gesture, this.velocity),
                0
              ),
              TRUE,
              FALSE
            ),
            this.isVisible
          )
        ),
      ]
    ),
    this.position,
  ]);

  private handleGestureEventHorizontal = Animated.event([
    {
      nativeEvent: {
        translationX: this.gesture,
        velocityX: this.velocity,
        state: this.gestureState,
      },
    },
  ]);

  private handleGestureEventVertical = Animated.event([
    {
      nativeEvent: {
        translationY: this.gesture,
        velocityY: this.velocity,
        state: this.gestureState,
      },
    },
  ]);

  // We need to ensure that this style doesn't change unless absolutely needs to
  // Changing it too often will result in huge frame drops due to detaching and attaching
  // Changing it during an animations can result in unexpected results
  private getInterpolatedStyle = memoize(
    (
      styleInterpolator: CardStyleInterpolator,
      current: Animated.Node<number>,
      next: Animated.Node<number> | undefined
    ) =>
      styleInterpolator({
        current,
        next,
        closing: this.isClosing,
        layout: this.layout,
      })
  );

  render() {
    const {
      layout,
      current,
      next,
      direction,
      gesturesEnabled,
      children,
      styleInterpolator,
    } = this.props;

    const { cardStyle, overlayStyle } = this.getInterpolatedStyle(
      styleInterpolator,
      current,
      next
    );

    const handleGestureEvent =
      direction === 'vertical'
        ? this.handleGestureEventVertical
        : this.handleGestureEventHorizontal;

    return (
      <View style={styles.container} pointerEvents="box-none">
        <Animated.Code exec={this.translate} />
        {overlayStyle ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.overlay, overlayStyle]}
          />
        ) : null}
        <PanGestureHandler
          enabled={layout.width !== 0 && gesturesEnabled}
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleGestureEvent}
        >
          <Animated.View style={[styles.card, cardStyle]}>
            {children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 5,
    shadowColor: '#000',
    backgroundColor: 'white',
    elevation: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});
