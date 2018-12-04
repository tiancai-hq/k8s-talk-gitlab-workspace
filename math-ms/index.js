const path = require('path')
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = path.resolve(__dirname, './protos/mathms.proto')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const mathms_proto = grpc.loadPackageDefinition(packageDefinition).exmath;

const GRPC_Methods = {
  Multiply: (call, callback) => {
    const a = call.request.a;
    const b = call.request.b;
    callback(null, {result: a*b});
  },
  Divide: (call, callback) => {
    const a = call.request.a;
    const b = call.request.b;
    if(b===0) {
      callback({ message: "cannot divide by 0", status: grpc.status.INVALID_ARGUMENT });
    }else{
      callback(null, {result: a/b});
    }
  },
  Add: (call, callback) => {
    const a = call.request.a;
    const b = call.request.b;
    callback(null, {result: a+b});
  },
  Subtract: (call, callback) => {
    const a = call.request.a;
    const b = call.request.b;
    callback(null, {result: a-b});
  },
  Pow: (call, callback) => {
    const a = call.request.a;
    const b = call.request.b;
    if(isNaN(Math.pow(a,b))){
      callback({ message: "invalid parameters for a^b", status: grpc.status.INVALID_ARGUMENT });
    }else{
      callback(null, {result: Math.pow(a,b)});
    }
  }
}


function main() {
  var server = new grpc.Server();
  server.addService(mathms_proto.MathService.service, GRPC_Methods);
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("Listening for connections on port '50051'");
}

main();
