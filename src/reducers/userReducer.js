const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return Object.assign({}, action.user);
    case 'REMOVE_USER':
      return null;
    default:
      return state;
  }
};

export default userReducer;
