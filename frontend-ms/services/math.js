const config = require('../config');
const path = require('path')
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.resolve(__dirname, '../protos/mathms.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const mathms_proto = grpc.loadPackageDefinition(packageDefinition).exmath;

const client = new mathms_proto.MathService(config.MATH_SERVICE_HOST, grpc.credentials.createInsecure());

function multiply(a,b) {
  return new Promise((resolve, reject) => {
    client.Multiply({a:a, b:b}, function (err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}
function divide(a,b) {
  return new Promise((resolve, reject) => {
    client.Divide({a:a, b:b}, function (err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}
function add(a,b) {
  return new Promise((resolve, reject) => {
    client.Add({a:a, b:b}, function (err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}
function subtract(a,b) {
  return new Promise((resolve, reject) => {
    client.Subtract({a:a, b:b}, function (err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}

function pow(a,b) {
  return new Promise((resolve, reject) => {
    client.Pow({a:a, b:b}, function (err, response) {
      if (err) {
        reject(err);
        return;
      }
      resolve(response);
    });
  });
}
module.exports = {
  multiply: multiply,
  divide: divide,
  add: add,
  subtract: subtract,
  pow: pow
};