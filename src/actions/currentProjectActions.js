export const setCurrentProject = (project) => {
  return {
    type: 'SET_CURRENT_PROJECT',
    project
  };
};

export const removeCurrentProject = () => {
  return {
    type: 'REMOVE_CURRENT_PROJECT'
  };
};
