import * as ActionTypes from './ActionTypes';

export const comments = (state = {
    isLoading: true,
    errMess: null,
    comments: []
  }, action) => {
    switch(action.type){
      case ActionTypes.ADD_COMMENTS:
        return {...state, errMess: null, comments: action_payload};

      case ActionTypes.COMMEN_FAILED:
        return {...state, errMess: action_payload, comments: []};

      default:
        return state;
    }
  }
