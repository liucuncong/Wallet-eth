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
console.log('json',json)
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
