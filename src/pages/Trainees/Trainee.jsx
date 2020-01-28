import React from 'react';
import {
  BrowserRouter as Router, Switch, Route,
} from 'react-router-dom';
import TraineeList from './TraineeList';
import TraineeDetail from './TraineeDetail';

export const Trainee = (props) => {
  const { match } = props;
  return (
    <React.Fragment>
      <Router>  
        <Switch>
          <Route exact path={`${match.url}/:id`} component={TraineeDetail} />
          <Route exact path={`${match.url}`} component={TraineeList} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};
