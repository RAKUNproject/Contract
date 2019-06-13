
# Rakun Public Contract

## Contract

- *RakunCoin*   
ERC20Token


## SetUp (Local Environment)

※ Node.js is necessary

#### Install the EthereumClient
Install and Launch the Ethereum Client Application “Ganche”

https://truffleframework.com/ganache

#### Contract Deployment (via ganche)
※ Booting an Ethereum Client Environment is required

```
npm install
./node_modules/.bin/truffle migrate
```

#### Test
※ Booting an Ethereum Client Environment is required

```
npm run test
```

#### Coverage
※ Booting an Ethereum Client Environment is required

```
npm run coverage
```


## Deploy (Mainnet Environment)

#### Changing Environments
Prepare the Ethereum Mainnet access point and change the ‘host’ and ‘port’ of ‘truffle.js’’
```
mainnet: {
  host: "127.0.0.1",
  port: 8545,
  network_id: 1,
  gasPrice: 20000000000
}
```

#### Contract Deployment (Mainnet)
```
./node_modules/.bin/truffle migrate --network mainnet
```
