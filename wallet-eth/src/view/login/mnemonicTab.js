import React, {Component} from 'react'
import {Form, Segment, Button} from "semantic-ui-react"
import service from "../../services/service";
import PubSub from 'pubsub-js'

class MnemonicTab extends Component {
    state = {
        mnemonic : "",
        path: "m/44'/60'/0'/0/0", //分层钱包path
        wallets:[],
    }


    handleGenMnemonic = () => {
        let words = service.createRandomMnemonic()
        console.log('words',words)
        this.setState({
          mnemonic: words,
        })

    }

    //捕捉数据
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value })
        console.log('name :', name)
        console.log('value :', value)
    }

    //根据助记词生成钱包
    onMMICClick = () => {
        //1. 需要助记词
        //2. 需要path
        let { mnemonic, path } = this.state;

        try {
            let wallets =  service.createWalletFromMnemonic(
                mnemonic,
                path /*这个path目前没有使用 */
            )

            //3. 钱包有效时，发布消息
            if (wallets) {
                this.setState({wallets})

                //发布login成功的事件,
                //事件名字
                //传递的数据
                PubSub.publish("onLoginSuccessfully", wallets)
                console.log(this.state.wallets)
            }

        }catch (e) {
            alert("私钥生成钱包失败!")
        }


    }


    render() {
        return (
            <Form size="large">
                <Segment stacked>
                    <Form.TextArea
                        placeholder="12 words"
                        name="mnemonic"
                        value={this.state.mnemonic}
                        onChange={this.handleChange}
                    />
                    <Form.Input
                        fluid
                        icon="user"
                        iconPosition="left"
                        name="path"
                        value={this.state.path}
                        onChange={this.handleChange}
                    />
                    <Button onClick={this.handleGenMnemonic}>随机生成</Button>
                    <br />
                    <br />

                    <Form.Button onClick = {this.onMMICClick} color="teal" fluid size="large">
                        助记词导入(下一步)
                    </Form.Button>
                </Segment>
            </Form>
        );
    }
}

export default MnemonicTab