import os
from concurrent import futures
import time
import argparse
import base64
import numpy as np
from keras.models import load_model
import grpc
import mlservice_pb2
import mlservice_pb2_grpc

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class ExampleMLService(mlservice_pb2_grpc.MLServiceServicer):
    _model = None

    @classmethod
    def ocrB64Image(cls, b64str):
        try:
            model = cls.get_or_create_model()
            result = -1
            arr=base64.b64decode(b64str)
            if len(arr) != 784:
                return -2
            img = np.frombuffer(arr, np.uint8)
            img = np.array([np.multiply(img,1.0/255.0)])
            img = img.reshape(img.shape[0],1,28,28)
            result = np.argmax(model.predict(img),axis=1)[0]
            return result
        except base64.binascii.Error as bError:
            print("Invalid base64")
            return -3
        except Exception as err:
            print(err)
            return -4

    @classmethod
    def get_or_create_model(cls):
        """
        Get or create ML Service model.
        """
        if cls._model is None:
            path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model', 'digitsmodel.hdf5')
            cls._model = load_model(path)
        return cls._model

    def PredictDigit(self, request, context):
        imgb64 = request.image
        result = self.__class__.ocrB64Image(imgb64)
        return mlservice_pb2.DigitResult(result=result)


def serve(port, max_workers):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=max_workers))
    mlservice_pb2_grpc.add_MLServiceServicer_to_server(ExampleMLService(), server)
    server.add_insecure_port('[::]:{port}'.format(port=port))
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Process some integers.')
    parser.add_argument('--port', type=int, help='port number', required=False, default=50052)
    parser.add_argument('--max_workers', type=int, help='# max workers', required=False, default=10)
    args = parser.parse_args()

    serve(port=args.port, max_workers=args.max_workers)
