import React, { Fragment, useEffect, useState } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line } from "recharts";
import io from "socket.io-client";
import { connect } from "react-redux";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import useForceUpdate from "use-force-update";

import { saveGraph } from "../actions/saveGraph";

var socket = io();

const Graphs = ({ realtimeStream, saveGraph }) => {
  const forceUpdate = useForceUpdate();
  const [realtimeData, setRealtimeData] = useState([]);

  const [recording, setRecording] = useState(false);
  const [formData, setFormData] = useState({ notes: "" });

  useEffect(() => {
    socket.on("changeData", (changeData) => {
      console.log(changeData);
      setRealtimeData(changeData);
    });

    // forceUpdate(); // Forces the component to update

    return () => {
      socket.off("changeData");
    };
  }, []);

  const { height, width } = useWindowDimensions();

  const onStart = () => {
    // Start recording torque, power and rpm values from the above array and putting them into a graph.
    setRecording(true);
  };

  const onEnd = () => {
    setRecording(false);
  };

  const onReset = () => {
    // Resetting realtime data
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    saveGraph({
      date: new Date(),
      notes: formData.notes,
      runData: realtimeStream,
    });
  };

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      {/* <LineChart width={width} height={height} data={realtimeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <YAxis yAxisId="right1" orientation="right" />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="Torque (ft-lb)"
          isAnimationActive={false}
          stroke="#8884d8"
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="Power (hp)"
          isAnimationActive={false}
          stroke="#82ca9d"
          dot={false}
        />
        <Line
          yAxisId="right1"
          type="monotone"
          dataKey="Rpm (revolutions per minute)"
          isAnimationActive={false}
          stroke="#a85232"
          dot={false}
        />
      </LineChart> */}
      <LineChart width={width} height={height} data={realtimeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Rpm (revolutions per minute)" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="Torque (ft-lb)"
          isAnimationActive={false}
          stroke="#8884d8"
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="Power (hp)"
          isAnimationActive={false}
          stroke="#82ca9d"
          dot={false}
        />
      </LineChart>
      {/* <div className="controls">
        <div className="buttons">
          <Button variant="outline-success" onClick={onStart}>
            Start Recording
          </Button>
          <Button variant="outline-warning" onClick={onEnd}>
            End Recording
          </Button>
          <Button variant="outline-danger" onClick={onReset}>
            Reset
          </Button>
        </div>
        <Form className="Form">
          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={(e) => onChange(e)}
              name="notes"
              id="notes"
            />
          </Form.Group>
          <Button variant="primary" type="submit" onSubmit={(e) => onSubmit(e)}>
            Submit
          </Button>
        </Form>
      </div> */}
    </Fragment>
  );
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

Graphs.propTypes = {
  realtimeStream: PropTypes.array,
  saveGraph: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  realtimeStream: state.realtimeData,
});

export default connect(mapStateToProps, {
  saveGraph,
})(Graphs);
