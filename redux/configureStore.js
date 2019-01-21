import { createStore, combineReducers, applyMiddleware} form 'redux';
import thunk form 'redux-thunk';
import logger from 'redux-logger';
import { dishes } from './dishes';
import {comments} from './comments';
import {promotions} from './promotions';
import {leaders} from './leaders';

export const ConfigureStore = () => {
  const store = createStore(
    combineReducers({
      dishes,
      comments,
      promotions,
      leaders
    }),
    applyMiddleware(thunk, logger)
  );

  return store;
}
