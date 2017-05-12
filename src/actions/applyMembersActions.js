export const addAllApplyMembers = (applies) => {
  return {
    type: 'ADD_ALL_APPLY_MEMBERS',
    applies
  };
};

export const toggleApplyMemberCheck = (id) => {
  return {
    type: 'TOOGLE_APPLY_MEMBER_CHECK',
    id
  };
};

export const checkAllApplyMembers = () => {
  return {
    type: 'CHECK_ALL_APPLY_MEMBERS'
  };
};

export const uncheckAllApplyMembers = () => {
  return {
    type: 'UNCHECK_ALL_APPLY_MEMBERS'
  };
};

export const removeApplyMember = (id) => {
  return {
    type: 'REMOVE_APPLY_MEMBER',
    id
  };
};
