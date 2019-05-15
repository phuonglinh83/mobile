import { Platform } from "react-native";

const constants = {
  IS_ENV_DEVELOPMENT: __DEV__,
  IS_ANDROID: Platform.OS === "android",
  IS_IOS: Platform.OS === "ios",
  IS_DEBUG_MODE_ENABLED: Boolean(window.navigator.userAgent),
  TOP_K_RECOMMENDATIONS: 12,
  TOP_K_SIMILAR_VIDEOS: 10,
};

export default constants;
