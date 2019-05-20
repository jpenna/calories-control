function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = {
  pwa: {
    workboxOptions: {
      runtimeCaching: [{
        urlPattern: new RegExp(`${escapeRegExp(process.env.VUE_APP_API_URL)}`),
        handler: 'staleWhileRevalidate',
      }],
    },
  },
};
