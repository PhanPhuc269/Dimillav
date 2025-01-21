const webPush = require('web-push');

const publicVapidKey = 'BIkKFa3E0LgzLXJPMT0w1mY9zbxyoE3kENb-CoRbDvKNyd91RO7cGT-7We0fXQQO2n4UaSWvbcEnx06X9PImWW8';
const privateVapidKey = 'cU92eHIDx9KCRstMV_fyQvuk8Iz3Vfoy3HLWBzbn-nE';

webPush.setVapidDetails(
  'mailto:php2692004@gmail.com',
  publicVapidKey,
  privateVapidKey
);

module.exports = webPush;