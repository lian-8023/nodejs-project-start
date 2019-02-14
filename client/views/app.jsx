import React from 'react';
import {Router, Route, Link, hashHistory, IndexRoute} from 'react-router';
import {observer,inject} from "mobx-react"; 
import { observable, action, computed ,configure,runInAction} from "mobx";

@inject('allStore') @observer
class App extends React.Component {
    constructor(props){
        super(props);
        this.channelStore=this.props.allStore.ChannelStore;  //调用allStore.js中定义的对象
        this.state = {};
    }
    render() {
        let menuList=this.channelStore.menuList;
        return (
            <div  className='content' id='content'>
                <ul className='nav'>
                   <li><Link to='/'> Home</Link></li>
                   <li><Link to='About'> About</Link></li>
                </ul>
                {this.props.children}
            </div>
        );
    }
};

export default App;