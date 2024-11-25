const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// Obtener la configuración predeterminada
const defaultConfig = getDefaultConfig(__dirname);

// Filtrar las extensiones de activos para excluir 'svg'
const assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');

// Añadir 'svg' a las extensiones de origen
const sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];

const config = {
  transformer: {
    // Especificar el transformador para SVG
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts,
    sourceExts,
  },
};

// Combinar la configuración predeterminada con la nueva configuración
module.exports = mergeConfig(defaultConfig, config);
