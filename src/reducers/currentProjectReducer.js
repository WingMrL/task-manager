const currentProjectReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return Object.assign({}, action.project);
    case 'REMOVE_CURRENT_PROJECT':
      return null;
    default:
      return state;
  }
};

export default currentProjectReducer;
