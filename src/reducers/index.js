import { combineReducers } from 'redux';
import hasSignIn from './hasSignInReducer';
import user from './userReducer';
import currentTeam from './currentTeamReducer';


const TaskManagerApp = combineReducers({
  hasSignIn,
  user,
  currentTeam,
});

export default TaskManagerApp;
