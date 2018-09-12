#/bin/bash

if [ ! -d "./livepeer_linux" ];then
    wget https://github.com/livepeer/go-livepeer/releases/download/0.3.1/livepeer_linux.tar.gz && \
    tar -xzvf livepeer_linux.tar.gz && rm livepeer_linux.tar.gz & mv ./livepeer_linux/livepeer /usr/bin
fi
## Should use a random generated password for the account generator
npm i && node accountGenerator.js
./livepeer_linux/livepeer -rinkeby -v 6 -ethKeystorePath ./keystore/ -ethPassword 'eduadiez' -httpAddr 0.0.0.0:8935 -rtmpAddr 0.0.0.0:1935 -ethUrl ws://my.rinkeby.dnp.dappnode.eth:8546 &
sleep 10
node initLivepeer.js