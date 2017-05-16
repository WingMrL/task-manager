const currentTaskReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_CURRENT_TASK':
      return Object.assign({}, action.task);
    case 'REMOVE_CURRENT_TASK':
      return null;
    default:
      return state;
  }
};

export default currentTaskReducer;
