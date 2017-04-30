import React from 'react';
import { Route, BrowserRouter as Router, IndexRoute} from 'react-router-dom';
import Index from './Views/Index';
import InnerGroup from './Views/InnerGroup';
import SearchResult from './Views/SearchResult';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Index}/>
          <Route path="/innergroup/:groupid" component={InnerGroup}/>
          <Route path="/searchresult" component={SearchResult}/>
        </div>
      </Router>
    );
  }
}

export default App;