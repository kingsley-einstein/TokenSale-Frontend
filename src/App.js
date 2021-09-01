import React from "react";
import styled from "styled-components";
import HomePage from "./pages/Home";

const Body = styled.div`
  position: relative;
`;

const App = props => (
  <Body>
    <HomePage />
  </Body>
);

export default App;
