const { defineConfig } = require('@vue/cli-service'); 

module.exports = defineConfig( {
  transpileDependencies: [],

  // Output directory for the built files
  outputDir: '../public/dist',

  // Base URL for your assets
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',

  // Additional configurations can be added here if needed
});




// const { defineConfig } = require('@vue/cli-service'); 

// module.exports = defineConfig( {
//   transpileDependencies: [],

//   // Output directory for the built files
//   outputDir: '../public/dist',

//   // Base URL for your assets
//   publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',

//   // Additional configurations can be added here if needed
// });

