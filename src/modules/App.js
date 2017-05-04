import React from 'react';
import { Route, BrowserRouter as Router, IndexRoute} from 'react-router-dom';
import Index from './Views/Index';
import SignIn from './Views/SignIn';
import SignUp from './Views/SignUp';
import Teams from './Views/Teams';
import Projects from './Views/Projects';
import NewProjects from './Views/NewProjects';
import Members from './Views/Members';
import InviteNewMember from './Views/InviteNewMember';
import Member from './Views/Member';

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
          <Route exact path="/teams/:teamId/projects/new" component={NewProjects}/>
          <Route exact path="/teams/:teamId/members" component={Members}/>
          <Route exact path="/teams/:teamId/invite/new" component={InviteNewMember}/>
          <Route exact path="/members/:userId" component={Member}/>
        </div>
      </Router>
    );
  }
}

export default App;