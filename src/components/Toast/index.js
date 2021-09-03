import styled from "styled-components";
import "./index.css";

const Toast = styled.div`
  min-width: 250px;
  margin-left: -125px;
  background-color: ${props => props.backgroundColor || "#333"};
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
`;

const ToastComponent = props => (
  <Toast
    backgroundColor={props.isErrorToast ? "red" : "green"}
    className={props.isShown ? "snackbar show" : "snackbar"}
    {...props}
  />
);

export default ToastComponent;
