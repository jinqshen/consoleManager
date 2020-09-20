const { override, fixBabelImports, addLessLoader, addWebpackPlugin, } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const path = require('path');
const { getThemeVariables } = require('antd/dist/theme');

process.env.GENERATE_SOURCEMAP = "true";

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {  }
        }
    }),
    addWebpackPlugin(new AntdDayjsWebpackPlugin())
);