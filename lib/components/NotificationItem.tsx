import React from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  Dimensions,
  View,
} from "react-native";
import { Notification, Nullable } from "./type";

type Props = {
  notification?: Notification;
  onRemove(): void;
};

const easing = Easing.inOut(Easing.sin);

const { width } = Dimensions.get("window");

export const NotificationItem: React.FC<Props> = ({
  notification,
  onRemove,
}) => {
  const { current: animationValue } = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    if (!notification) {
      return;
    }

    const showConfig = {
      toValue: 1,
      easing,
      duration: 250,
      useNativeDriver: true,
    };
    const delayConfig = {
      toValue: 1,
      easing,
      duration: 1000,
      useNativeDriver: true,
    };
    const hideConfig = {
      toValue: 0,
      easing,
      duration: 250,
      useNativeDriver: true,
    };

    let anim: Nullable<Animated.CompositeAnimation> = Animated.timing(
      animationValue,
      showConfig,
    );

    anim.start((show) => {
      if (!show.finished) {
        return;
      }
      anim = Animated.timing(animationValue, delayConfig);
      anim.start((delay) => {
        if (!delay.finished) {
          return;
        }
        anim = Animated.timing(animationValue, hideConfig);
        anim.start((hide) => {
          if (!hide.finished) {
            return;
          }
          anim = null;
          onRemove();
        });
      });
    });
    return () => {
      if (anim) {
        anim.stop();
      }
      onRemove();
    };
  }, [animationValue, notification, onRemove]);

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { transform: [{ translateY }], opacity: animationValue },
      ]}
    >
      <View style={[styles.content]}>
        <Text style={[styles.title]}>{notification?.title}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 30,
    left: 12,
    width: width - 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#008CFB",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: "white",
    marginLeft: 8,
    fontWeight: "400",
  },
});
