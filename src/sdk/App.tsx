import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Header from './Header';
import { HashRouter as Router, Switch, Route} from 'react-router-dom';
import Context from './Context';

import StartPage from './StartPage';
import ConnectWalletPage from './ConnectWalletPage';
import WelcomeDidPage from './WelcomeNftPage';
import LoginDidPage from './LoadNftPage';
import LoginPage from './LoginPage';
import AppPage from './AppPage';


function App() {

  const [status, setStatus] = useState(
    [
      {
        walletConnect: false,
        DIDCreate: false,
        loginPage: false,
        login: false,
        DID: "did:freeton:0:5f485220e7421608c117f4c71b569975b0331eda88098522917dd741f0d3757f"
      }
    ]
  )

  return (
    <Router>
      <Context.Provider value={{status : status}}>
        <div className="App">
          <Header></Header>
          <Switch>
            <Route exact path="/" component={ConnectWalletPage}></Route>
            {/* <Route exact path="/connect-wallet" component={ConnectWalletPage}></Route> */}
            <Route exact path="/welcome-did" component={WelcomeDidPage}></Route>
            <Route exact path="/login-did" component={LoginDidPage}></Route>
            <Route exact path="/login" component={LoginPage}></Route>
            <Route exact path="/app" component={AppPage}></Route>
          </Switch>
        </div>
      </Context.Provider>
    </Router>
  );
}

export default App;
