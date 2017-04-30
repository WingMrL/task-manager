const icons = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ALL_ICONS_TO_ICONS':
      return [...action.icons];
    case 'REMOVE_ALL_ICONS_FROM_ICONS':
      return []
    default:
      return state
  }
};

export default icons;
