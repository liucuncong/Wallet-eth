import React, {Component} from 'react';
import './App.css';
import LoginTab from './view/login/login';
import {Container} from "semantic-ui-react";
import PubSub from 'pubsub-js'
import Wallets from "./view/wallet/wallet";


class App extends Component {
    state = {
        wallets:[], //保存从login界面得到的钱包
        loginFlag:false,
    }

    componentDidMount() {
        // 在挂载的时候，注册login登录成功订阅事件
        PubSub.subscribe('onLoginSuccessfully',this.onLoginSuccessfully)

    }

    onLoginSuccessfully = (eventMsg, data) => {
        console.log('eventMsg :', eventMsg)
        console.log('data :', data)
        this.setState({
            wallets:data,
            loginFlag:true,
        })
    }

    render() {
        let {wallets,loginFlag} = this.state
        let content = loginFlag ? <Wallets wallets = {wallets} />:<LoginTab/>


        return (
            <Container>
                {content}
            </Container>

        );
    }

}

export default App;
