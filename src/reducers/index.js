import { combineReducers } from 'redux';
import icons from './icons';
import selectedIcons from './selectedIcons';

const iconLibraryApp = combineReducers({
  icons,
  selectedIcons,
});

export default iconLibraryApp;
