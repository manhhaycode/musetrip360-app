const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Lấy config mặc định của Expo
const config = getDefaultConfig(projectRoot);

// ⚡ Cho phép Metro đọc node_modules ở cả app + root (monorepo)
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Kết hợp với NativeWind
module.exports = withNativeWind(config, { input: './global.css' });
