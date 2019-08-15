
const request = require('request');

const svcUrl = 'https://platform.quip.com/1/';
// const svcUrl = 'http://localhost:3000/1/';

// should work with a lot more than uploading, but those have not been tested
const _uploadCall = (client, path, callback, formArguments) => {
  var requestOptions = {
      url: svcUrl + path,
      headers: {
        Authorization: 'Bearer ' + client.accessToken
      },
      formData: formArguments
  };

  // console.log(requestOptions);
  request.post(requestOptions, (err, response, body) => {
    if (err) {
      callback(error, null);
      return;
    }
    var responseObject = null;
    try {
        responseObject = JSON.parse(body);
    } catch (err) {
        callback(err, null);
        return;
    }
    if (response.statusCode != 200) {
        callback(new ClientError(response, responseObject), null);
    } else {
        callback(null, responseObject);
    }
    console.log('Upload successful!  Server responded with:', body);
  });

}

// Blob/Image Support
const putBlob = function(client, options, callback) {
    var args = {
        'blob': {
          value: options.blob,
          options: {
            filename: options.name
          }
        }
    };
    _uploadCall(client, `blob/${options.threadId}`, callback, args);
};



exports.putBlob = putBlob;
