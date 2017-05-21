export const setUserTasks = (tasks) => {
  // console.log('asdfasdf');
  return {
    type: 'SET_USER_TASKS',
    tasks
  };
};


export const toggleTaskShowInUserTasks = (id) => {
    return {
        type: 'TOGGLE_TASK_SHOW_IN_USER_TASKS',
        id,
    };
};