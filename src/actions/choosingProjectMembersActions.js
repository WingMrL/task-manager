export const addAllChoosingProjectMembers = (members) => {
  return {
    type: 'ADD_ALL_CHOOSING_PROJECT_MEMBERS',
    members
  };
};

export const toggleChoosingProjectMemberCheck = (id) => {
  return {
    type: 'TOOGLE_CHOOSING_PROJECT_MEMBER_CHECK',
    id
  };
};

export const checkAllChoosingProjectMembers = () => {
  return {
    type: 'CHECK_ALL_CHOOSING_PROJECT_MEMBERS'
  };
};

export const uncheckAllChoosingProjectMembers = () => {
  return {
    type: 'UNCHECK_ALL_CHOOSING_PROJECT_MEMBERS'
  };
};

export const removeChoosingProjectMember = (id) => {
  return {
    type: 'REMOVE_CHOOSING_PROJECT_MEMBER',
    id
  };
};

export const removeAllChoosingProjectMember = () => {
  return {
    type: 'REMOVE_ALL_CHOOSING_PROJECT_MEMBER'
  };
};
