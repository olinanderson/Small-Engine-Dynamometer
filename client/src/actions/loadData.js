import axios from "axios";
import { LOAD_DATA, LOAD_DATA_FAIL } from "./types";

// Load user
export const loadData = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/loadData");

    // Loading initial stream
    dispatch({
      type: LOAD_DATA,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);

    dispatch({
      type: LOAD_DATA_FAIL,
    });
  }
};
