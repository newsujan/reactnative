import * as ActionTypes from './ActionTypes';

export const dishes = (state = {
    isLoading: true,
    errMess: null,
    dishes: []
  }, action) => {
    switch(action.type){
      case ActionTypes.ADD_DISHES:
        return {...state, isLoading: false, errMess: null, dishes: action_payload};

      case ActionTypes.DISHES_LOADING:
        return {...state, isLoading: true, errMess: null, dishes: []};

      case ActionTypes.DISHES_FAILED:
        return {...state, isLoading: false, errMess: action_payload, dishes: []};

      default:
        return state;
    }
  }
