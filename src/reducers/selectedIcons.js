const selectedIcon = (state, action) => {
  switch (action.type) {
    case 'ADD_ICON_TO_SELECTED_ICONS':
      return {
        id: action.id,
        icon: action.icon
      };

    case 'REMOVE_ICON_FROM_SELECTED_ICONS':
      let index = -1;
      state.forEach((value, i) => {
        if(value.id === action.id) {
          index = i;
        }
      });
      if(index > -1) {
        return [
          ...state.slice(0, index),
          ...state.slice(index + 1)
        ]
      }
      return state;

    case 'ADD_ALL_ICONS_TO_SELECTED_ICONS': 
        return action.icons.map((value) => {
            return {
                id: value._id,
                icon: value
            };
        });

    case 'REMOVE_ALL_ICONS_FROM_SELECTED_ICONS':
        return [];
        
    default:
      return state
  }
};

const selectedIcons = (state = [], action) => {
  switch (action.type) {
    case 'ADD_ICON_TO_SELECTED_ICONS':
        return [
            ...state,
            selectedIcon(undefined, action)
        ];

    case 'REMOVE_ICON_FROM_SELECTED_ICONS':
        return selectedIcon(state, action);

    case 'ADD_ALL_ICONS_TO_SELECTED_ICONS':
    case 'REMOVE_ALL_ICONS_FROM_SELECTED_ICONS':
        return selectedIcon(undefined, action);

    default:
        return state
  }
};

export default selectedIcons;
