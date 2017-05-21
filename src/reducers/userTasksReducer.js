const userTasksReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER_TASKS':
      return action.tasks.map((v) => {
              return {
                  _id: v._id,
                  show: false,
                  task: Object.assign({}, v)
              };
          });
    case 'TOGGLE_TASK_SHOW_IN_USER_TASKS':
      return state.map((v) => {
              if(v._id == action.id) {
                  return Object.assign({}, v, {
                          show: !v.show,
                      });
              } else {
                  return v;
              }
          });
    default:
      return state;
  }
};

export default userTasksReducer;
