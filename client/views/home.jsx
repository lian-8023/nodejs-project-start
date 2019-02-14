import React from 'react';
import {Router, Route, Link, hashHistory, IndexRoute} from 'react-router';
import {observer,inject} from "mobx-react"; 
import { observable, action, computed ,configure,runInAction} from "mobx";

@inject('allStore') @observer
class Home extends React.Component {
    render() {
        return (
            <div>
               <h3>I am Home page !</h3>
            </div>
        );
    }
};

export default Home;