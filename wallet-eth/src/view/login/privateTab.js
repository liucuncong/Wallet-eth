import React, { Component } from 'react';
import { Form, Segment, Button } from "semantic-ui-react";
import service from '../../services/service';
import PubSub from 'pubsub-js'


class PrivateKeyTab extends Component {
    state = {
        privateKey: "",
        wallets: [], //数组
    }

    handleCreateClick = () => {
        let wallet = service.createRandomWallet()
        console.log('wallet privateKey :', wallet.privateKey)
        console.log('wallet address :', wallet.address)
        this.setState({ privateKey:wallet.privateKey })
    }

    //捕捉数据
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
        console.log('name :', name)
        console.log('value :', value)
    }


    onPrivateLoginClick = () => {
        //获取私钥（自动生成，用户输入）
        let privateKey = this.state.privateKey

        let res = service.checkPrivateKey(privateKey)
        if (res) {
            alert(res)
            return
        }

        //单个钱包
        let wallet = service.createWalletByPrivateKey(privateKey)

        if (wallet) {
            let wallets = []
            wallets.push(wallet) //得到了只有一个wallet的钱包数组
            this.setState({
                wallets
            })
            console.log('wallets',wallets)

            //发布login成功的事件
            //事件名
            //传递的数据
            PubSub.publish("onLoginSuccessfully", wallets) //事件名字，事件传递数据
        } else {
            alert("私钥生成钱包失败!")
        }

    }



    render() {
        return (
            <Form size="large">
                <Segment>
                    <Form.Input
                        fluid
                        icon="lock"
                        iconPosition="left"
                        placeholder="private key"
                        name="privateKey"
                        value={this.state.privateKey}
                        onChange={this.handleChange}
                    />
                    <Button onClick={this.handleCreateClick}>随机生成 </Button>{" "}
                    <br />
                    <br />
                    <Button
                        color="teal"
                        fluid
                        size="large"
                        onClick={this.onPrivateLoginClick}
                    >
                        私钥导入(下一步){" "}
                    </Button>{" "}
                </Segment>{" "}
            </Form>

        );
    }

}

export default PrivateKeyTab;
