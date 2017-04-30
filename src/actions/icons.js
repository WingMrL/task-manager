export const addAllIconsToIcons = (icons) => {
  return {
    type: 'ADD_ALL_ICONS_TO_ICONS',
    icons
  };
};

export const removeAllIconsFromIcons = () => {
  return {
    type: 'REMOVE_ALL_ICONS_FROM_ICONS'
  };
};
