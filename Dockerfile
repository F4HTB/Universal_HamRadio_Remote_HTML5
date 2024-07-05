FROM alpine:latest
MAINTAINER Niccolò Izzo <n@izzo.sh>

ENV HAMLIB_VERSION '4.5.5'

# Install dependencies
RUN apk add --no-cache git \
                       python3 \
                       py3-pyalsaaudio \
                       py3-numpy \
                       py3-tornado \
                       py3-pyserial \
                       py3-pyaudio \
                       py3-hamlib \
                       py3-pip \
                       librtlsdr \
                       autoconf \
                       automake \
                       libtool \
                       swig \
                       alpine-sdk
RUN apk add --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing py3-pam
RUN pip3 install pyrtlsdr --break-system-packages

# Build hamlib from source
RUN mkdir /hamlib
WORKDIR /hamlib
RUN git clone https://github.com/Hamlib/Hamlib.git src
RUN cd src && git checkout Hamlib-$HAMLIB_VERSION && ./bootstrap && mkdir ../build && cd ../build && \
 ../src/configure --prefix=$HOME/hamlib-prefix    --disable-shared --enable-static    --without-cxx-binding --disable-winradio    CFLAGS="-g -O2 -fdata-sections -ffunction-sections"  LDFLAGS="-Wl,--gc-sections" && \
 make -j4 &&  make install-strip && cd ../../

# Copy UHRR source files from host dir
RUN mkdir /uhrh
WORKDIR /uhrh
COPY . /uhrh
RUN ls /uhrh

# ENV PYTHONPATH=/usr/local/lib/python3.7/site-packages:$PYTHONPATH
CMD ["./UHRR"]
