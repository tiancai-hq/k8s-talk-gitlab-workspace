#!/bin/sh
MLPY_VERSION="v1.0.0"

cd tiancai-ml-py
docker build -t "tiancaicommunity/tiancai-ml-py:$MLPY_VERSION" .
docker tag "tiancaicommunity/tiancai-ml-py:$MLPY_VERSION" "tiancaicommunity/tiancai-ml-py:latest"
docker push "tiancaicommunity/tiancai-ml-py:$MLPY_VERSION"
docker push "tiancaicommunity/tiancai-ml-py:latest"
cd ..

