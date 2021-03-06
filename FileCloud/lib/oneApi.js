const fs = require('fs');
const axios = require('axios');
const mime = require('mime-types');

const apiUrl = 'https://graph.microsoft.com/v1.0/me/drive/';

async function download(params) {
  if (!params.accessToken) {
    throw new Error('Missing Access Token');
  }
  if (!params.fileName) {
    throw new Error('Missing File Name');
  }
  if (!params.filePath) {
    throw new Error('Missing File Path');
  }

  var options = {
    method: 'GET',
    url: apiUrl + 'root:/' + encodeURIComponent(params.fileName),
    headers: {
      Authorization: 'Bearer ' + params.accessToken,
    },
  };
  var response = await axios(options);
  const fileId = response.data.id;

  const path = `${params.filePath}/${params.fileName}`;
  var options = {
    method: 'GET',
    url: apiUrl + 'items/' + fileId + '/content',
    headers: {
      Authorization: 'Bearer ' + params.accessToken,
    },
    responseType: 'stream',
  };
  var response = await axios(options);
  const item = response.data;
  const writeStream = fs.createWriteStream(path);

  writeStream.on('error', function () {
    new Error('Invalid File Path');
  });

  var end = new Promise((resolve, reject) => {
    var buffer = [];
    item.on('data', (data) => {
      writeStream.write(data);
      writeStream.on('error', function () {
        reject('Invalid File Path');
      });
      buffer.push(data);
    });
    item.on('end', () => {
      writeStream.end();
      resolve(Buffer.concat(buffer));
    });
  });
  return await end;
}

async function upload(params) {
  if (!params.accessToken) {
    throw new Error('Missing Access Token');
  }
  if (!params.fileName) {
    throw new Error('Missing File Name');
  }
  if (!params.filePath) {
    throw new Error('Missing File Path');
  }

  const path = `${params.filePath}/${params.fileName}`;
  const data = await fs.promises.readFile(path);

  var options = {
    method: 'PUT',
    url:
      apiUrl +
      'items/root:/' +
      encodeURIComponent(params.fileName) +
      ':/content',
    headers: {
      'Content-Type': mime.lookup(path),
      Authorization: 'Bearer ' + params.accessToken,
    },
    data: data,
    encoding: null,
  };
  axios(options);
  return Buffer.from(data);
}

async function read(params) {
  if (!params.accessToken) {
    throw new Error('Missing Access Token');
  }
  if (!params.fileName) {
    throw new Error('Missing File Name');
  }

  var options = {
    method: 'GET',
    url: apiUrl + 'root:/' + encodeURIComponent(params.fileName),
    headers: {
      Authorization: 'Bearer ' + params.accessToken,
    },
  };
  var response = await axios(options);
  const fileId = response.data.id;

  var options = {
    method: 'GET',
    url: apiUrl + 'items/' + fileId + '/content',
    headers: {
      Authorization: 'Bearer ' + params.accessToken,
    },
    responseType: 'arraybuffer',
  };
  var response = await axios(options);
  return Buffer.from(new Uint8Array(response.data));
}

module.exports = {
  download,
  upload,
  read,
};
