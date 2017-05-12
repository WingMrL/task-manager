const choosingProjectMembersReducer = (state = null, action) => {
  switch (action.type) {
    case 'ADD_ALL_CHOOSING_PROJECT_MEMBERS':
      return action.members.map((v) => {
                return {
                    _id: v._id,
                    checked: true,
                    member: Object.assign({}, v)
                }
            });
    case 'TOOGLE_CHOOSING_PROJECT_MEMBER_CHECK':
        return state.map((v) => {
                if(v._id === action.id) {
                    return Object.assign({}, v, {
                        checked: !v.checked
                    });
                } else {
                    return v;
                }
            });
    case 'CHECK_ALL_CHOOSING_PROJECT_MEMBERS':
        return state.map((v) => {
                return Object.assign({}, v, {
                    checked: true
                });
            });
    case 'UNCHECK_ALL_CHOOSING_PROJECT_MEMBERS':
        return state.map((v) => {
                return Object.assign({}, v, {
                    checked: false
                });
            });
    case 'REMOVE_CHOOSING_PROJECT_MEMBER':
        return state.filter((v) => {
                return v._id !== action.id
            });
    case 'REMOVE_ALL_CHOOSING_PROJECT_MEMBER':
        return null;
    default:
      return state;
  }
};

export default choosingProjectMembersReducer;
