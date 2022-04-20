/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import config from "./src/API/config";

console.disableYellowBox = true
console.log("Web configuration:", config);

AppRegistry.registerComponent(appName, () => App);