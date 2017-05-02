const currentTeamReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TEAM':
      return Object.assign({}, action.team);
    case 'REMOVE_CURRENT_TEAM':
      return null;
    default:
      return state;
  }
};

export default currentTeamReducer;
