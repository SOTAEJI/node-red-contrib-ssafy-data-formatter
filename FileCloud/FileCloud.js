const { google } = require('googleapis');

module.exports = function (RED) {
  const googleApi = require('./lib/googleApi');
  const oneApi = require('./lib/oneApi');

  function FileCloudNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.status({});

    this.on('input', async (msg, send) => {
      const doType = config.doType;
      const cloudType = config.cloudType;
      const fileName = msg.payload.fileName || config.fileName;
      const filePath = msg.payload.filePath || config.filePath;
      const credentials = RED.nodes.getCredentials(config.id);
      const dataFormat = fileName ? fileName.split('.') : '';
      msg.dataFormat = dataFormat[dataFormat.length - 1];
      
      var param = {
        fileName,
        filePath,
      };

      if (cloudType === 'google') {
        const refreshToken = credentials.refreshToken;
        const redirectURI = 'https://developers.google.com/oauthplayground';
        const auth = new google.auth.OAuth2(
          credentials.clientId,
          credentials.clientSecret,
          redirectURI
        );
        auth.setCredentials({ refresh_token: refreshToken });
        const drive = google.drive({
          version: 'v3',
          auth,
        });
        param['drive'] = drive;
      } else if (cloudType === 'one') {
        const accessToken = credentials.accessToken;
        param['accessToken'] = accessToken;
      }

      switch (doType) {
        case 'download':
          var api = cloudType === 'google' ? googleApi : oneApi;
          api
            .download(param)
            .then((val) => {
              msg.filePath = `${filePath}/${fileName}`;
              msg.data = val;
              send(msg);
            })
            .catch((error) => {
              node.status({ fill: 'red', shape: 'dot', text: 'error' });
              node.error('Download failed: ' + error.toString(), msg);
            });
          break;
        case 'upload':
          var api = cloudType === 'google' ? googleApi : oneApi;
          api
            .upload(param)
            .then((val) => {
              msg.filePath = `${filePath}/${fileName}`;
              msg.data = val;
              send(msg);
            })
            .catch((error) => {
              node.status({ fill: 'red', shape: 'dot', text: 'error' });
              node.error('Upload failed: ' + error.toString(), msg);
            });
          break;
        case 'read':
          var api = cloudType === 'google' ? googleApi : oneApi;
          api
            .read(param)
            .then((val) => {
              msg.data = val;
              send(msg);
            })
            .catch((error) => {
              node.status({ fill: 'red', shape: 'dot', text: 'error' });
              node.error('Read failed: ' + error.toString(), msg);
            });
      }
    });
  }

  RED.nodes.registerType('FileCloud', FileCloudNode, {
    credentials: {
      accessToken: {type: 'password', required: true},
      clientId: {type: 'password', required: true},
      clientSecret: {type: 'password', required: true},
      refreshToken: {type: 'password', required: true}
    },
  });
};
