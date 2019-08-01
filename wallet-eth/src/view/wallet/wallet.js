import React, { Component } from "react";
import AccountTab from "./accountTab";
import { ethers } from "ethers";
import TransactionTab from "./transactionTab";
import service from "../../services/service";
import SettingTab from "./settingTab";
import { Select } from "semantic-ui-react";


class Wallets extends Component {
    constructor(props) {
        super(props);
        //state变量，
        //1. 如果实现了构造函数，在构造函数内使用方式：this.state = {xxxx}
        //2. 如果在构造函数外使用，直接state= {xxxx}
        this.state = {
            wallets: props.wallets,
            walletSelected: 0, //默认使用第0

            //与AccountTab(当前钱包相关的数据）
            address: "",
            balance: 0,
            txCount: 0,
            //这里的walletActive要设置为""，不能设置为{},否则this.state.walletActive会一直有值，SettingTab页面加载有问题
            walletActive: "", //已经连接到区块链的钱包，可以直接与网络交互
        };
    }

    componentDidMount() {
        try {
            this.updateCurrentWallet(this.state.walletSelected)
            console.log("wallets数据:", this.state.wallets)
        } catch (e) {
            console.log(e)
        }

    }

    //获取wallet在指定以太网网络的详情 : address, balance, txCount
    async updateCurrentWallet(index) {
        //1.获取钱包
        let wallet = this.state.wallets[index];
        console.log("wallet 1111 : ", wallet);

        //2.连接到指定的网络
        //连接到巧克力，或ropsten等
        //1:创建provider， 启动巧克力
        let provider = new ethers.providers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );
        console.log("provider 2222:", provider);

        //2:钱包连接provider
        let walletActive = wallet.connect(provider);

        //返回值中才会包含连接好provider的数据，原wallet不会设置，注意！！！
        console.log("wallet 2222 : ", wallet);
        console.log("walletActive 3333 : ", walletActive);

        //3.获取address, balance, txCount
        let address = await walletActive.getAddress(); //会做一些处理
        let balance = await walletActive.getBalance();
        let txCount = await walletActive.getTransactionCount();

        console.log('address :', address)
        console.log('balance :', ethers.utils.formatEther(balance))
        console.log('txCount :', txCount)

        //设置到状态变量
        this.setState({ address, balance, txCount, walletActive })
    }

    onSendClick = async (txto, txvalue) => {
        console.log("txto: ", txto);
        console.log("txvalue: ", txvalue);

        //txto是否为有效地址
        if (!service.checkAddress(txto)) {
            alert("转账地址无效!")
            return
        }

        //txvalue是否为数字
        if (isNaN(txvalue)) {
            alert("转账数字无效!")
            return
        }

        //转账逻辑
        let walletActive = this.state.walletActive  //得到激活的钱包
        console.log('walletActive', walletActive)

        //这个转换动作必须做，否则不满足转账数据类型, 会出错
        txvalue = ethers.utils.parseEther(txvalue)
        console.log("txvalue222 : ", txvalue)

        try {
            let res = await walletActive.sendTransaction({
                to: txto,
                value: txvalue,
            });
            console.log("转账返回结果详细信息 :", res)
            alert("转账成功!")

            //更新展示页面
            this.updateCurrentWallet(this.state.walletSelected)
        } catch (e) {
            alert("转账失败!")
            console.log(e)
        }

    }

    onChangeClicked = index => {
        console.log("当前选择的index:", index);
        this.updateCurrentWallet(index);
    }


    render() {
        return (
            <div>
                {
                    this.state.wallets.length > 1 && (
                        <Select
                            onChange={(event, data) => {
                                this.onChangeClicked(data.value);
                            }}
                            placeholder="请选择地址:"
                            options={service.addressIndexOptions}
                        />
                    )
                }

                <AccountTab allInfo={this.state} />,
                <TransactionTab onSendClick={this.onSendClick} />,
                {this.state.walletActive && (
                    <SettingTab walletActive={this.state.walletActive} />

                )}
            </div>

        )
    }
}

export default Wallets;

