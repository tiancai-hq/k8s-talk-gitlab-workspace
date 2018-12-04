FROM tiancaicommunity/tiancai-ml-py:v1.0.0
WORKDIR /app-home


# Environment variables
ENV MAX_WORKERS 1
ENV PORT 50052


EXPOSE 50052


COPY . /app-home/
RUN python3 codegen.py
CMD python3 grpc_server.py --max_workers ${MAX_WORKERS} --port ${PORT}
