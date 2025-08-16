module.exports = function (api) {
  api.cache(false);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
          jsxImportSource: 'nativewind',
        },
      ],
      'nativewind/babel',
    ],

    overrides: [
      {
        plugins: ['@babel/plugin-transform-class-static-block'],
      },
    ],
  };
};
