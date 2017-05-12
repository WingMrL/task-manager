export const setCurrentTasks = (tasks) => {
  console.log('asdfasdf');
  return {
    type: 'SET_CURRENT_TASKS',
    tasks
  };
};


export const toggleTaskInCurrentTasks = (id) => {
    return {
        type: 'TOGGLE_TASK_IN_CURRENT_TASKS',
        id,
    };
};