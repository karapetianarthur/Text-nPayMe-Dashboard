import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import './App.scss';

import {useEffect} from "react";
import Signup from "./Singup/Signup";

import mainLogo from './images/main-logo.png';
import facebookLogo from './images/facebook.png';
import instagramLogo from './images/instagram.png';
import tiktokLogo from './images/tik-tok.png';
import whatsupLogo from './images/whatsapp.png';
import viberLogo from './images/viber.png';
import telegramLogo from './images/telegram.png';

const App = () => {

  useEffect(() => {
  }, []);

  return (
      <Router>
        <div className="App">
          <Switch>
            <Route path={'/signup'}>
              <div className={'main-container'}>
                <div className={'right-container'}>
                  <img src={mainLogo} />
                  <p>
                    With our extension you will be able to perform transactions through text and voice commands in any messaging window you are in. Register and enjoy the limitless experience.
                  </p>
                  <div className={'icons-container'}>
                    <img src={facebookLogo}  alt=""/>
                    <img src={instagramLogo}  alt=""/>
                    <img src={tiktokLogo}  alt=""/>
                    <img src={whatsupLogo}  alt=""/>
                    <img src={viberLogo}  alt=""/>
                    <img src={telegramLogo}  alt=""/>
                  </div>
                </div>
                <Signup />
              </div>
            </Route>
            <Route path={'/home'}>
              <div>hkome</div>
            </Route>
            <Route path={'/signin'}>
              <div>sign</div>
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
