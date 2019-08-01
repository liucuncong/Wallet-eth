# 基本概念介绍



私钥: 256为数字

地址：由私钥推导出的

助记词：由一个128位的随机数种子，按照一定规则生成的12个单词（如果随机数种子是256为，那么助记词为24个），记住了助记词，就用于了对应地址的控制权，不要自己去写12个单词，因为有校验规则。

json文件（keystore）：是有私钥导出的json格式文件，理解为私钥，但是可以设置密码





>1. 一个私钥对应一个地址
>
>   1. 私钥是256为数字
>
>   2. 问题：当地址有很多时，私钥不好管理
>
>2. bip32: 可以使用一个随机数种子，可以派生出一系列私钥，进而得到一系列地址
>
>   1. 种子是128位的数字，=>n多个256私钥=>n多个地址
>   2. 问题：种子是数字，不友善
>
>3. bip39: 把随机数种子按照一定的规则，生成出唯一的12个单词（有校验码的，不要随便写）
>   1. 128位的种子=>12个单词（便于保存）=>一系列私钥=>一系列地址2
>   2. 问题：bip39只适用于比特币，其他的币种无法使用
>4. bip44: 它是基于bip33做了改进，引入了分层确定性概念，把钱包做了分层
>   1. HD Path:  m/44'/60'/0'/0/{account_index}
>      1. 44: bip44
>      2. 60: 以太坊，0：比特币，
>      3. 0
>      4. 0
>      5. index就是这个助记词所能够生成的第几个地址

![image-20190402144523248](https://ws4.sinaimg.cn/large/006tKfTcly1g1oadgc2i1j31f00dm7f6.jpg)





# 与以太坊交互的库

## 1. web3（官方）

- 部署合约，调用合约
- 工具函数
- eth转账相关



## 2. ethers.js

- web3功能都具备
- 创建钱包相关的功能（web3不具备）





## 3. 5种生成钱包方法demo

```js
let ethers = require('ethers')

//1. 指定私钥获取钱包
//私钥：256位，随机数种子：128位
let privateKey1 = '0xd31eb076b4a43e3dcb08750e1a7af93d88a26ec78327feeadfceb21233555594'
let w1 = new ethers.Wallet(privateKey1)
console.log('w1 privateKey :', w1.privateKey)
console.log('w1 address :', w1.address)

//2. 随机创建一个新的钱包
let w2 = ethers.Wallet.createRandom()
console.log('w2 privateKey :', w2.privateKey)
console.log('w2 address :', w2.address)

//3. 给定json文件，生成钱包
let data = {
    id: "fb1280c0-d646-4e40-9550-7026b1be504a",
    address: "88a5c2d9919e46f883eb62f7b8dd9d0cc45bc290",
    Crypto: {
        kdfparams: {
            dklen: 32,
            p: 1,
            salt: "bbfa53547e3e3bfcc9786a2cbef8504a5031d82734ecef02153e29daeed658fd",
            r: 8,
            n: 262144
        },
        kdf: "scrypt",
        ciphertext: "10adcc8bcaf49474c6710460e0dc974331f71ee4c7baa7314b4a23d25fd6c406",
        mac: "1cf53b5ae8d75f8c037b453e7c3c61b010225d916768a6b145adf5cf9cb3a703",
        cipher: "aes-128-ctr",
        cipherparams: {
            iv: "1dcdf13e49cea706994ed38804f6d171"
        }
    },
    "version": 3
};

let json = JSON.stringify(data);
let password = "foo";

ethers.Wallet.fromEncryptedJson(json, password).then(function (wallet) {
    console.log("w3 Address: " + wallet.address);
    console.log("w3 privateKey: " + wallet.privateKey);
    // "Address: 0x88a5C2d9919e46F883EB62F7b8Dd9d0CC45bc290"
});

//4. 给定助记词，生成钱包
let mnemonic = 'scout same naive genius cannon maze differ acquire penalty habit surround ice'
let path0 = "m/44'/60'/0'/0/0" //address : 0xd5957914c31e1d785ccc58237d065dd25c61c4d0
let path1 = "m/44'/60'/0'/0/1" //address : 0x18cec83129c0a766012a26863419640cd5f89400
let w4_a = ethers.Wallet.fromMnemonic(mnemonic, path0)
console.log("w4_a Address: " + w4_a.address);
console.log("w4_a privateKey: " + w4_a.privateKey);

let w4_b = ethers.Wallet.fromMnemonic(mnemonic, path1)
console.log("w4_b Address: " + w4_b.address);
console.log("w4_b privateKey: " + w4_b.privateKey);

//5. 随机创建一个助记词钱包
//私钥：256位，随机数种子：128位

let randValue = ethers.utils.randomBytes(16)
let w5_mnemonic = ethers.utils.HDNode.entropyToMnemonic(randValue)
console.log('w5助记词:', w5_mnemonic)
```



![4417DA47-9831-4E76-8133-C558B2324BEE](https://ws1.sinaimg.cn/large/006tKfTcly1g1o1yuvk4mj31ci0pewne.jpg)