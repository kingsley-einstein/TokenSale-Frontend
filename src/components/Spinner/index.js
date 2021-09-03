import styled from "styled-components";
import "./index.css";

export default styled.div`
  border: ${props => props.border || "3px solid #f3f3f3"};
  border-top: ${props => props.borderTop || "3px solid #3498db"};
  border-radius: 50%;
  width: 8px;
  height: 8px;
  animation: spinner 1s linear infinite;
`;
