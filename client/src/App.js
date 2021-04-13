import "./App.css";
import { useEffect } from "react";
import Graphs from "./components/Graphs";
import { initialRequests } from "./actions/initial";
import store from "./store";
import { Provider } from "react-redux";

function App() {
  useEffect(() => {
    store.dispatch(initialRequests());
  }, []);

  return (
    <div className="App">
      <Provider store={store}>
        <Graphs />
      </Provider>
    </div>
  );
}

export default App;
