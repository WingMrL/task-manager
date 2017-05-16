import { combineReducers } from 'redux';
import hasSignIn from './hasSignInReducer';
import user from './userReducer';
import currentTeam from './currentTeamReducer';
import currentTask from './currentTaskReducer';
import currentProject from './currentProjectReducer';
import applyMembers from './applyMembersReducer';
import choosingProjectMembers from './choosingProjectMembersReducer';
import currentTasks from './currentTasksReducer';

const TaskManagerApp = combineReducers({
  hasSignIn,
  user,
  currentTeam,
  applyMembers,
  choosingProjectMembers,
  currentProject,
  currentTasks,
  currentTask
});

export default TaskManagerApp;
