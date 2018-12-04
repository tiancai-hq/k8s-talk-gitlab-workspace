FROM python:3.6-slim


ENV BUILD_PACKAGES="\
        build-essential \
        linux-headers-4.9 \
        python3-dev \
        git \
        curl" \
    APT_PACKAGES="\
        ca-certificates \
        openssl \
        libpng16-16 \
        libhdf5-dev \
        libjpeg62-turbo" \
    PIP_PACKAGES="\
        h5py \
        protobuf \
        numpy \
        pandas \
        grpcio \
        grpcio-tools \
        tensorflow \
        keras" \
    LANG=C.UTF-8

RUN set -ex; \
    apt-get update -y; \
    apt-get upgrade -y; \
    apt-get install -y ${APT_PACKAGES}; \
    apt-get install -y ${BUILD_PACKAGES}; \
    pip install -U setuptools wheel; \
    pip install -U ${PIP_PACKAGES}; \
    apt-get remove --purge --auto-remove -y ${BUILD_PACKAGES}; \
    apt-get clean; \
    apt-get autoclean; \
    apt-get autoremove; \
    rm -rf /tmp/* /var/tmp/*; \
    rm -rf /var/lib/apt/lists/*; \
    rm -rf /var/cache/apt/archives/*.deb \
        /var/cache/apt/archives/partial/*.deb \
        /var/cache/apt/*.bin; \
    find /usr/lib/python3 -name __pycache__ | xargs rm -rf; \
    rm -rf /root/.[acpw]*

CMD ["/bin/bash"]