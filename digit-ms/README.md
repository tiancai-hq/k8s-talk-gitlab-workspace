# Kubernetes Machine Learning Microservice
This is a kubernetes machine learning microservice that predicts digit from a 28x28 bitmap

## How to set up an environment on our local machine
The command creates an anaconda environment.
We can activate the environment with `source activate mlservice-demo`, since the environment name is `mlservice-demo`.
```
# Create an anaconda environment.
conda env create -f environment.yml -n mlservice-demo

# Verify that the new environment was installed correctly, active environment is shown with '*'.
conda env list

# Remove the anaconda environment.
conda env remove -y -n mlservice-demo
```

## How to run the server and the client on our local machine
Before running the predictor as a docker container, we can run the server and client on our local machine.
```
# Run serve.
python grpc_server.py

# Run client.
python grpc_test_client.py
```

## How to build and run a docker image
We put the python files and saved model in the docker image.
Besides, the docker image is used for running `grpc_server.py`.

The host name depends on your environment.
If you use `docker-machine`, we can see the IP address with `docker-machine ip YOUR_DOCKER_MACHINE`.

The docker image exposes `50052` port for the gRPC server.
As well as, the gRPC server uses `50052`.
That's why we put `-p 50052:50052` in the `docker run` command.
```
# Build a docker image.
docker build . -t mlservice-demo

# Run a docker container.
docker run --rm -d -p 50052:50052 --name mlservice-demo mlservice-demo

# Kill the docker container
docker kill mlservice-demo
```

And then, we check if the client can access the server on docker or not:

```
# Execute it on your local machine, not a docker container.
python grpc_test_client.py --host HOST_NAME --port 50052
result: 8
```


# Credits
### GRPC Demo from https://github.com/yu-iskw/machine-learning-microservice-python