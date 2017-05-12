const applyMembersReducer = (state = null, action) => {
  switch (action.type) {
    case 'ADD_ALL_APPLY_MEMBERS':
      return action.applies.map((v) => {
                return {
                    _id: v._id,
                    checked: true,
                    apply: Object.assign({}, v)
                }
            });
    case 'TOOGLE_APPLY_MEMBER_CHECK':
        return state.map((v) => {
                if(v._id === action.id) {
                    return Object.assign({}, v, {
                        checked: !v.checked
                    });
                } else {
                    return v;
                }
            });
    case 'CHECK_ALL_APPLY_MEMBERS':
        return state.map((v) => {
                return Object.assign({}, v, {
                    checked: true
                });
            });
    case 'UNCHECK_ALL_APPLY_MEMBERS':
        return state.map((v) => {
                return Object.assign({}, v, {
                    checked: false
                });
            });
    case 'REMOVE_APPLY_MEMBER':
        return state.filter((v) => {
                return v._id !== action.id
            });
    default:
      return state;
  }
};

export default applyMembersReducer;
