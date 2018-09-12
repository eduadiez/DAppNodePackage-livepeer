var Web3 = require('web3');
const request = require('request');

var web3 = new Web3('ws://my.rinkeby.dnp.dappnode.eth:8546');
const lptContract = new web3.eth.Contract(
    [{ "constant": true, "inputs": [], "name": "mintingFinished", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_amount", "type": "uint256" }], "name": "burn", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_subtractedValue", "type": "uint256" }], "name": "decreaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "finishMinting", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_addedValue", "type": "uint256" }], "name": "increaseApproval", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [], "name": "MintFinished", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }],
    "0x24f56ef2fed379421bee64ecafc2bc744f72522b")


function ethAddr() {
    return new Promise((resolve, reject) => {
        request('http://localhost:7935/ethAddr', {}, (err, res, body) => {
            if (err) { return console.log(err); }
            resolve(body);
        });
    })
}

function requestLPT() {
    return new Promise(async (resolve, reject) => {
        var addr = await ethAddr();
        console.log("Requesting LPT ", addr)
        lptContract.events.Transfer({ fromBlock: 'latest', to: addr })
            .on('data', event => {
                console.log('transfer', event)
                request('http://localhost:7935/tokenBalance', {}, async (err, res, body) => {
                    if (err) { return console.log(err); }
                    if (body != 0) {
                        console.log('tokenBalance: ', body)
                        var bal = await web3.eth.getBalance(addr)
                        request.post('http://localhost:7935/deposit').form({ amount: (bal*0.8) },
                            (err, httpResponse, body) => {
                                console.log(body)
                            })
                    }
                    console.log(body)
                    resolve(body);
                });
                resolve();
            })
        await requestTokens();
    })
}

function requestTokens() {
    return new Promise((resolve, reject) => {
        request('http://localhost:7935/requestTokens', {}, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body)
            resolve(body);
        });
    })
}

ethAddr().then((addr) => {
    console.log("Account addres: " + addr)
    web3.eth.getBalance(addr).then((balance) => {
        console.log(balance)
        if (balance == 0) {
            var sub = web3.eth.subscribe('newBlockHeaders')
                .on("data", async function(blockHeader) {
                    web3.eth.getBalance(addr).then(async (bal) => {
                        console.log("Account: " + addr + ", balance:" + bal)
                        if (bal > 0) {
                            
                            sub.unsubscribe(function(error, success){
                                if(success)
                                    console.log('Successfully unsubscribed!');
                            });  
                            await requestLPT();
                        }
                    })
                })
                .on("error", console.error);
        } else {
            requestTokens().then((res) => {
                console.log(res)
            });
        }
    })
});