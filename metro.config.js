const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// module.exports = {
//   resolver: {
//     assetExts: [...defaultConfig.resolver.assetExts, 'db'],
//   },
// };
defaultConfig.resolver.assetExts.push('db');

module.exports = defaultConfig;