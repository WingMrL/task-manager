export const setCurrentTeam = (team) => {
  return {
    type: 'SET_CURRENT_TEAM',
    team
  };
};

export const removeCurrentTeam = () => {
  return {
    type: 'REMOVE_CURRENT_TEAM'
  };
};
