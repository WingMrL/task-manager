export const addIconToSelectedIcons = (icon) => {
  return {
    type: 'ADD_ICON_TO_SELECTED_ICONS',
    id: icon._id,
    icon
  };
};

export const removeIconFromSelectedIcons = (id) => {
  return {
    type: 'REMOVE_ICON_FROM_SELECTED_ICONS',
    id
  };
};

export const addAllIconsToSelectedIcons = (icons) => {
  return {
    type: 'ADD_ALL_ICONS_TO_SELECTED_ICONS',
    icons
  }
};

export const removeAllIconsFromSelectedIcons = () => {
  return {
    type: 'REMOVE_ALL_ICONS_FROM_SELECTED_ICONS'
  }
};
