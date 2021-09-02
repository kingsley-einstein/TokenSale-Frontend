import React, { useState, useReducer } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import Web3 from "web3";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { initialState } from "../../state";
import reducer from "../../state/reducer";
import logo from "../../xoximg.png";
import PresaleABI from "../../assets/ABI.json";

const NavFlex = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.marginTop || 0};
  padding: ${props => props.padding || 0};
`;

const Spacer = styled.div`
  flex: 0 1;
`;

const CenterFlex = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.marginTop || 0};
  padding: ${props => props.padding || 0};
`;

const SpanText = styled.span`
  font-size: ${props => props.fontSize || "13px"};
  font-weight: ${props => props.fontWeight || "normal"};
  font-style: ${props => props.fontStyle || "normal"};
  color: ${props => props.color || "black"};
  padding: ${props => props.padding || 0};
`;

const AnchorLink = styled.a`
  font-size: ${props => props.fontSize || "13px"};
  font-weight: ${props => props.fontWeight || "normal"};
  font-style: ${props => props.fontStyle || "normal"};
  color: ${props => props.color || "black"};
  padding: ${props => props.padding || 0};
`;

const DivInCenterFlex = styled.div`
  margin: ${props => props.margin || "0"};
`;

const FaArrowsAltH = styled(FontAwesomeIcon)`
  font-size: ${props => props.fontSize || "12px"};
`;

const Image = styled.img`
  width: ${props => props.width || "90px"};
  height: ${props => props.height || "90px"};
  border-radius: ${props => props.borderRadius || "50%"};
`;

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [bnbAmount, setBNBAmount] = useState(0);

  const setProvider = provider =>
    dispatch({
      type: "WEB3_INJECTED",
      payload: new Web3(provider)
    });

  const handleBNBInputChange = e => setBNBAmount(e.target.value);
  const injectProvider = () => {
    if (window.ethereum) {
      setProvider(window.ethereum);
      window.ethereum.send();
    }
  };

  return (
    <div>
      <NavFlex marginTop="2px" padding="2px">
        <div>
          <Image
            borderRadius="50%"
            src={logo}
            width="60px"
            height="60px"
            alt="XOXCASH Logo"
          />
        </div>
        <Spacer />
        <CenterFlex>
          <AnchorLink
            href="https://discord.gg/qqFF3BtQDq"
            fontSize="19px"
            fontWeight="bold"
            color="#ffffff"
            padding="2px 6px 2px 6px"
          >
            Discord
          </AnchorLink>
          <AnchorLink
            href="https://t.me/xoxgroupchat"
            fontSize="19px"
            fontWeight="bold"
            color="#ffffff"
            padding="2px 6px 2px 6px"
          >
            Telegram
          </AnchorLink>
          <AnchorLink
            href="https://twitter.com/x0xcash"
            fontSize="19px"
            fontWeight="bold"
            color="#ffffff"
            padding="2px 6px 2px 6px"
          >
            Twitter
          </AnchorLink>
        </CenterFlex>
        <Spacer />
        <Button
          color="black"
          backgroundColor="#ffffff"
          borderRadius="5px"
          fontStyle="normal"
          fontWeight="bold"
        >
          CONNECT METAMASK
        </Button>
      </NavFlex>
      <CenterFlex marginTop="40px" padding="14px">
        <DivInCenterFlex margin="3px 4px 3px 4px">
          <Input
            disabled
            padding="14px"
            border="0.7px solid #000000"
            value="1 XOXCASH"
          />
        </DivInCenterFlex>
        <DivInCenterFlex margin="3px 4px 3px 4px">
          <FaArrowsAltH icon={faEquals} color="#dcdcdc" fontSize="18px" />
        </DivInCenterFlex>
        <DivInCenterFlex margin="3px 4px 3px 4px">
          <Input
            disabled
            padding="14px"
            border="0.7px solid #000000"
            value="0.0025 BNB"
          />
        </DivInCenterFlex>
      </CenterFlex>
      <CenterFlex marginTop="40px" padding="14px">
        <DivInCenterFlex margin="2px">
          <Input
            padding="20px"
            border="0.7px solid #000000"
            width="400px"
            placeholder="Enter BNB amount"
            value={bnbAmount}
            type="number"
            onChange={handleBNBInputChange}
          />
        </DivInCenterFlex>
        <DivInCenterFlex margin="2px">
          <Button
            color="white"
            backgroundColor="#1642fa"
            borderRadius="5px"
            fontStyle="normal"
            fontWeight="bold"
            padding="20px"
            border="none"
          >
            Buy
          </Button>
        </DivInCenterFlex>
      </CenterFlex>
      <CenterFlex marginTop="40px" padding="14px">
        <DivInCenterFlex margin="2px">
          <SpanText
            fontSize="28px"
            fontWeight="bold"
            color="#ffffff"
            padding="2px 6px 2px 6px"
          >
            Sale ends in:{" "}
          </SpanText>
          <SpanText
            fontSize="34px"
            fontWeight="bold"
            color="#1642fa"
            padding="1px 4px 1px 4px"
          >
            13
          </SpanText>
          <SpanText fontSize="15px" fontWeight="normal" color="#ffffff">
            days
          </SpanText>
        </DivInCenterFlex>
      </CenterFlex>
    </div>
  );
};

export default Home;
