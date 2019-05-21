function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = {
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [{
        urlPattern: new RegExp(`${escapeRegExp(process.env.VUE_APP_API_URL)}`),
        handler: 'networkFirst',
        options: {
          networkTimeoutSeconds: 10,
        },
      }],
    },
  },
};
