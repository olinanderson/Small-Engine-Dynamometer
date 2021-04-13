import { combineReducers } from "redux";
import loadData from "./loadData";
import saveGraph from "./saveGraph";

export default combineReducers({
  loadData,
  saveGraph,
});
