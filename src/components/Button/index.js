import styled from "styled-components";

export default styled.button`
  padding: ${props => props.padding || "8px"};
  margin: ${props => props.margin || "8px"};
  color: ${props => props.color || "black"};
  font-size: ${props => props.fontSize || "13px"};
  border: ${props => props.border || "1px solid ghostwhite"};
  background-color: ${props => props.backgroundColor || "purple"};
  border-radius: ${props => props.borderRadius || 0};
  cursor: pointer;
  font-style: ${props => props.fontStyle || "normal"};
  font-weight: ${props => props.fontWeight || "normal"};

  @media screen and (max-width: 360px) {
    padding: ${props => props.mobilePadding || props.padding || "8px"};
    margin: ${props => props.mobileMargin || props.margin || "8px"};
    font-size: ${props => props.mobileFontSize || props.fontSize || "13px"};
  }
`;
