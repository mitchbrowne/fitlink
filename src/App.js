import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Home from './pages/Home';

export default () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
      </div>
    </Router>
  )
}
