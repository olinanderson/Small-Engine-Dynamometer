import { loadData } from "./loadData";

export const initialRequests = () => (dispatch) => {
  dispatch(loadData());
};
