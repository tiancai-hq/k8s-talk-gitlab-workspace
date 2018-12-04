const config = require('../config');
const path = require('path')
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.resolve(__dirname, '../protos/mlservice.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const mlservice_proto = grpc.loadPackageDefinition(packageDefinition).ml;
const client = new mlservice_proto.MLService(config.ML_SERVICE_HOST, grpc.credentials.createInsecure());

function predictDigitFromImage(greyscaleB64) {
  return new Promise((resolve, reject) => {
    client.predictDigit({image: greyscaleB64}, function (err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response.result);
    });
  });
}

module.exports = {
  predictDigitFromImage
};