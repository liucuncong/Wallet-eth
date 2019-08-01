import { ethers } from "ethers";
import _ from 'lodash';

// 2. 随机创建一个新的钱包
let createRandomWallet = () => {
    let wallet = ethers.Wallet.createRandom()

    return wallet

}

// 指定私钥获取钱包
let createWalletByPrivateKey = (privateKey) => {
    let w = new ethers.Wallet(privateKey)
    console.log('w1 privateKey :', w.privateKey)
    console.log('w1 address :', w.address)
    return w
}

let checkPrivateKey = (key) => {
    if (key === '') {
        return "不能为空!"
    }

    if (key.length != 66 && key.length != 64) {
        return "密钥长度为66位或64位16进制数字"
    }

    //^ : 开头
    //$ : 结尾
    //(0x)? : 可有可无
    //[0-9A-Fa-f]: 限定取值数据
    //{64}: 限定64个

    if (!key.match(/^(0x)?([0-9A-Fa-f]{64})$/)) {
        return "私钥为16进制表示,限定字符[0-9A-Fa-f]"
    }

    return ""
}


//校验地址有效性
let checkAddress = (address) => {
    try {
        let addressNew = ethers.utils.getAddress(address)
        return addressNew
    } catch (error) {
        return ""
    }
}

//生成随机的助记词
let createRandomMnemonic = () => {
    //16字节的随机数
    let value = ethers.utils.randomBytes(16)
    //生成助记词
    let words = ethers.utils.HDNode.entropyToMnemonic(value)

    return words
}


let MMICPATH_PREFIX = "m/44'/60'/0'/0/"

//根据助记词和path路径生成对应的钱包
let createWalletFromMnemonic = (mmic, path) => {
    //现在只使用一个地址，但是我们能够获取很多
    let wallets = []
    //只展示10个
    for (let i = 0; i < 10; i++) {
        let path1 = MMICPATH_PREFIX + i
        let w = ethers.Wallet.fromMnemonic(mmic, path1)
        wallets.push(w)
        console.log(i + ":" + w.address)
    }

    //以后扩展的时候，可以把wallets全部返回
    // return wallets[0]
    return wallets
}

//根据json和password生成钱包
let createWalletFromKeyStore = (keystore, password, callback) => {
    return new Promise(async (resolve, reject) => {
        // let wallets = [] //后续扩展
        console.log('type:', typeof keystore)
        try {
            // let w = await ethers.Wallet.fromEncryptedJson(keystore, password, (progress) => {
            //     console.log(parseInt(progress * 100) + '%')
            // })
            let w = await ethers.Wallet.fromEncryptedJson(keystore, password, callback)
            resolve(w)

        } catch (error) {
            reject(error)
        }
    })
}

let exportKeyStoreFromWallet = (wallet, password, callback) => {
    return new Promise(async (resolve, reject) => {
        try {
            // let keystore = await wallet.encrypt(password, p => {
            //     console.log(parseInt(p * 100) + '%')
            // })
            let keystore = await wallet.encrypt(password, callback)
            resolve(keystore)
        } catch (error) {
            reject(error)
        }
    })
}

const addressIndexOptions = _.map([0,1,2,3,4,5,6,7,8,9], index => ({
    key: index,
    text: index,
    value: index,
  }))


let service = {
    createRandomWallet,
    createWalletByPrivateKey,
    checkPrivateKey,
    checkAddress,
    createRandomMnemonic, //生成随机的助记词
    createWalletFromMnemonic, //根据助记词和path路径生成对应的钱包
    createWalletFromKeyStore, //根据json和password生成钱包
    exportKeyStoreFromWallet, //通过钱包，导出keystore文件，同时设置密码
    addressIndexOptions,
}

export default service



