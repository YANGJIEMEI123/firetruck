import React,{Component} from 'react';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import App from './App';
import CarInfor from './CarInfor';
import CarPart from './CarPart';
import CarState from './CarState';
import Log from './Log';
import Regist from './Regist';

class Routers extends Component {
    render(){
        return(
            <Router history={ browserHistory }>
                <Route path='/' component={Log}></Route>
                <Route path='/Regist' component={Regist}></Route>
                <Route path="/Index" component={App}>
                    <IndexRoute component={CarInfor} />
                    <Route path="/Index/CarInfor" component={CarInfor} />
                    <Route path="/Index/CarState" component={CarState} />
                    <Route path="/Index/CarPart" component={CarPart} />    
                </Route>
            </Router> 
        )
    }   
}
export default Routers;