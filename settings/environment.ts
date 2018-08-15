import { Platform } from 'react-native'
import * as RouteKeys from "../util/routes/routeKeys";

const DEFAULT_FIRST_SCREEN = RouteKeys.SPLASH

// if (Platform.OS === 'ios') {
//   DEFAULT_FIRST_SCREEN = LANDING
// }

export const ENV_DEVELOPMENT: string = 'development'
export const ENV_PRODUCTION: string = 'production'

export { DEFAULT_FIRST_SCREEN }
