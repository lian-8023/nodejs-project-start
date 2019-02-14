import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute,BrowserRouter } from 'react-router';
import {Provider} from 'mobx-react';
import * as allStoreJs from '../js/store/allStore';  //所有mobx监测的数据
let allStore=allStoreJs.default;
import '../css/style.less';
//组件
import App from './app';
import Home from './home';
import About from './about';

ReactDOM.render(
    <Provider allStore={allStore}>
        <Router history = {hashHistory} >
            <route path ="/" component={App} >
                <IndexRoute component={Home} />
                <route path ="/home" component={Home} />
                <route path ="/about" component={About} />
            </route>
        </Router>
    </Provider>,
    document.getElementById('index')
);