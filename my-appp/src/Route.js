import React,{Component} from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import {Switch} from 'react-router-dom';
import App from './App';
import CarInfor from './CarInfor';
import CarPart from './CarPart';
import CarState from './CarState';
import Log from './Log';
import Regist from './Regist';
import Test from './Test';
import Member from './Member';
import Allstorage from './storage';
import inbound from "./inbound";
import outbound from "./outbound";
// import PrivateRoute from './private';
class Routers extends Component {
    render(){
        return(
            <Router history={ browserHistory }>
                <Switch>
                <Route path='/' component={Log}></Route>
                <Route path='/Regist' component={Regist}></Route>
                <Route path="/Index" component={App}>
                    <IndexRoute component={CarInfor} />
                    <Route path="/Index/CarInfor" component={CarInfor} />
                    <Route path="/Index/CarState" component={CarState} />
                    <Route path="/Index/CarPart" component={CarPart} >    
                    <IndexRoute  component={Allstorage} />
                    <Route path="/Index/CarPart/Allstorage" component={Allstorage}/>
                    <Route path="/Index/CarPart/inbound" component={inbound}/>
                    <Route path="/Index/CarPart/outbound" component={outbound}/>
                    </Route>
                    <Route path="/Index/Member" component={Member} />
                    <Route path="/Index/Test" component={Test} />
                </Route>
                </Switch>
            </Router> 
        )
    }   
}
export default Routers;