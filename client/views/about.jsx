import React from 'react';
import {Router, Route, Link, hashHistory, IndexRoute} from 'react-router';
import {observer,inject} from "mobx-react"; 
import { observable, action, computed ,configure,runInAction} from "mobx";
import { Button } from 'antd';

@inject('allStore') @observer
class About extends React.Component {
    constructor(props){
        super(props);
        this.channelStore=this.props.allStore.ChannelStore;  //调用allStore.js中定义的对象
    }
    @action componentWillMount(){
        this.channelStore.channelArr=[];  //页面预加载时清空数据
    }
    render() {
        let channelArr=this.channelStore.channelArr;
        let demo=this.channelStore.demo;
        return (
            <div>
                <ul>
                    {
                        (demo&&demo.length>0)?demo.map((repy,i)=>{
                                return <li key={i}>{repy}</li>
                        }):''
                    }
                </ul>
                <div style={{'marginTop':'10px','marginLeft':'10px'}}>
                    <Button type="primary" icon="search" onClick={this.channelStore.getChanel.bind(this)}>Search</Button>
                </div>
                <ul>
                    {
                        (channelArr&&channelArr.length>0)?channelArr.map((repy,i)=>{
                                return <li key={i}>{repy.name}</li>
                        }):''
                    }
                </ul>
            </div>
        );
    }
};

export default About;