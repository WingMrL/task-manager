import React from 'react';
import { Route, BrowserRouter as Router, IndexRoute} from 'react-router-dom';
import Index from './Views/Index';
import SignIn from './Views/SignIn';
import SignUp from './Views/SignUp';
import Teams from './Views/Teams';
import Projects from './Views/Projects';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Index}/>
          <Route exact path="/user/sign_in" component={SignIn}/>
          <Route exact path="/user/sign_up" component={SignUp}/>
          <Route exact path="/teams" component={Teams}/>
          <Route exact path="/teams/:teamId/projects" component={Projects}/>
        </div>
      </Router>
    );
  }
}

export default App;