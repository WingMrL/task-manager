export const setCurrentTask = (task) => {
  return {
    type: 'SET_CURRENT_TASK',
    task
  };
};

export const removeCurrentTask = () => {
  return {
    type: 'REMOVE_CURRENT_TASK'
  };
};
