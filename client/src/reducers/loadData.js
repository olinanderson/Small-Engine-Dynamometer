import { LOAD_DATA, LOAD_DATA_FAIL } from "../actions/types";

const initialState = [];

const loadData = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_DATA:
      return {
        ...state,
        realtimeData: payload,
      };
    case LOAD_DATA_FAIL:
      return {
        ...state,
        realtimeData: [],
      };
    default:
      return state;
  }
};

export default loadData;
