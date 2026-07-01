import React, { useEffect } from "react";
import { Dimensions, KeyboardAvoidingView, Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const SCREEN_HEIGHT = Dimensions.get("window").height;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  height?: number;
  children: React.ReactNode;
}

export default function BottomSheet({
  visible,
  onClose,
  height = SCREEN_HEIGHT * 0.65,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.value = visible
      ? withSpring(0, { damping: 20, stiffness: 120, overshootClamping: true })
      : withTiming(height, { duration: 250 });
  }, [visible]);

  const dismiss = () => {
    translateY.value = withTiming(height, { duration: 250 }, () => runOnJS(onClose)());
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 500) {
        translateY.value = withTiming(height, { duration: 250 }, () => runOnJS(onClose)());
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 120 });
      }
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={styles.overlay} behavior="padding">
          <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} />
          <Animated.View style={[styles.sheet, { height, paddingBottom: insets.bottom }, animStyle]}>
            {/* Only the handle area is draggable — keeps the content area free for taps and the slider */}
            <GestureDetector gesture={pan}>
              <View style={styles.handleArea}>
                <View style={styles.handle} />
              </View>
            </GestureDetector>
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handleArea: {
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: -20,
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#DDD",
  },
});
