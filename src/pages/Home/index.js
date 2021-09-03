/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useReducer, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEquals } from "@fortawesome/free-solid-svg-icons";
import Web3 from "web3";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Spinner from "../../components/Spinner";
import Toast from "../../components/Toast";
import { initialState } from "../../state";
import reducer from "../../state/reducer";
import logo from "../../xoximg.png";
import PresaleABI from "../../assets/ABI.json";
import { CONTRACT_ADDRESS } from "../../assets/env";

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

  @media screen and (max-width: 360px) {
    font-size: ${props => props.mobileFontSize || props.fontSize || "13px"};
    padding: ${props => props.mobilePadding || props.padding || 0};
  }
`;

const AnchorLink = styled.a`
  font-size: ${props => props.fontSize || "13px"};
  font-weight: ${props => props.fontWeight || "normal"};
  font-style: ${props => props.fontStyle || "normal"};
  color: ${props => props.color || "black"};
  padding: ${props => props.padding || 0};

  @media screen and (max-width: 360px) {
    font-size: 13px;
  }
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

  @media screen and (max-width: 360px) {
    width: ${props => props.mobileWidth || props.width || "90px"};
    height: ${props => props.mobileHeight || props.height || "90px"};
  }
`;

const explorer =
  process.env.NODE_ENV !== "production"
    ? "https://testnet.bscscan.com/tx/"
    : "https://bscscan.com/tx/";

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [bnbAmount, setBNBAmount] = useState(0);
  const [daysLeft, setDaysLeft] = useState("0");
  const [hoursLeft, setHoursLeft] = useState("0");
  const [minutesLeft, setMinutesLeft] = useState("0");
  const [secondsLeft, setSecondsLeft] = useState("0");
  const [presaleContract, setPresaleContract] = useState(null);
  const [buyLoading, setBuyLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const setProvider = provider =>
    dispatch({
      type: "WEB3_INJECTED",
      payload: new Web3(provider)
    });

  const setAccount = account =>
    dispatch({
      type: "ACCOUNT_SET",
      payload: account
    });

  const setRate = rate =>
    dispatch({
      type: "RATE_SET",
      payload: rate / 10 ** 18
    });

  const handleBNBInputChange = e => setBNBAmount(e.target.value);

  const injectProvider = () => {
    if (window.ethereum) {
      setProvider(window.ethereum);
    }
  };

  const setContract = () => {
    const contract = new state.provider.eth.Contract(
      PresaleABI,
      CONTRACT_ADDRESS
    );
    console.log(CONTRACT_ADDRESS);
    setPresaleContract(contract);
  };

  const requestAccounts = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(accounts => setAccount(accounts[0]));
    }
  };

  const watchAccountsChange = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accounts =>
        setAccount(accounts[0])
      );
    }
  };

  const loadTime = async () => {
    const remainingDays = await presaleContract.methods
      .getRemainingDays()
      .call();
    const jsDate = new Date(Date.now() + remainingDays * 1000).getTime();
    const x = setInterval(() => {
      const now = new Date().getTime();
      const diff = jsDate - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const daysAsString = days.toFixed(0);
      const hoursAsString = hours.toFixed(0);
      const minutesAsString = minutes.toFixed(0);
      const secondsAsString = seconds.toFixed(0);
      setDaysLeft(daysAsString);
      setHoursLeft(hoursAsString);
      setMinutesLeft(minutesAsString);
      setSecondsLeft(secondsAsString);

      if (diff < 0) {
        clearInterval(x);
        setDaysLeft("0");
        setHoursLeft("0");
        setMinutesLeft("0");
        setSecondsLeft("0");
      }
    }, 1000);
  };

  const getRate = async () => {
    const rate = await presaleContract.methods.getRate().call();
    setRate(rate);
  };

  const buy = async () => {
    try {
      setBuyLoading(true);
      const tx = await presaleContract.methods
        .buyXOX()
        .send({ from: state.account, value: bnbAmount * 10 ** 18 });
      setBuyLoading(false);
      setToastMessage("Transaction executed: ");
      setErrorToast(false);
      setTxHash(tx.transactionHash);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (error) {
      setBuyLoading(false);
      setToastMessage("An error occured");
      setErrorToast(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  useEffect(() => {
    injectProvider();
    watchAccountsChange();
  }, []);

  useEffect(() => {
    if (!!state.provider) setContract();
  }, [state.provider]);

  useEffect(() => {
    if (!!presaleContract) {
      loadTime();
      getRate();
    }
  }, [presaleContract]);

  return (
    <div>
      <NavFlex marginTop="2px" padding="2px">
        <div>
          <Image
            borderRadius="50%"
            src={logo}
            width="70px"
            height="70px"
            alt="XOXCASH Logo"
            mobileHeight="30px"
            mobileWidth="30px"
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
            target="_blank"
          >
            Discord
          </AnchorLink>
          <AnchorLink
            href="https://t.me/xoxgroupchat"
            fontSize="19px"
            fontWeight="bold"
            color="#ffffff"
            padding="2px 6px 2px 6px"
            target="_blank"
          >
            Telegram
          </AnchorLink>
          <AnchorLink
            href="https://twitter.com/x0xcash"
            fontSize="19px"
            fontWeight="bold"
            color="#ffffff"
            padding="2px 6px 2px 6px"
            target="_blank"
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
          onClick={requestAccounts}
          padding="8px"
          mobilePadding="2px"
        >
          {!!state.account
            ? state.account.substring(0, state.account.length - 36) +
              "..." +
              state.account.substring(state.account.length - 4)
            : "Connect Metamask"}
        </Button>
      </NavFlex>
      <CenterFlex marginTop="40px" padding="14px">
        <DivInCenterFlex margin="2px">
          <SpanText
            fontSize="40px"
            fontWeight="normal"
            color="#ffffff"
            padding="2px 6px 2px 6px"
          >
            Buy XoXCash
          </SpanText>
        </DivInCenterFlex>
      </CenterFlex>
      <CenterFlex marginTop="10px" padding="8px">
        <DivInCenterFlex margin="3px 4px 3px 4px">
          <Input
            disabled
            padding="20px"
            border="0.7px solid #000000"
            value="1 XOXCASH"
            mobilePadding="4px"
          />
        </DivInCenterFlex>
        <DivInCenterFlex margin="3px 4px 3px 4px">
          <FaArrowsAltH icon={faEquals} color="#dcdcdc" fontSize="18px" />
        </DivInCenterFlex>
        <DivInCenterFlex margin="3px 4px 3px 4px">
          <Input
            disabled
            padding="20px"
            border="0.7px solid #000000"
            value={`${state.rate || 0} BNB`}
            mobilePadding="4px"
          />
        </DivInCenterFlex>
      </CenterFlex>
      <CenterFlex marginTop="40px" padding="14px">
        <DivInCenterFlex margin="2px">
          <Input
            padding="20px"
            border="0.7px solid #000000"
            borderRadius="5px"
            width="400px"
            placeholder="Enter BNB amount"
            value={bnbAmount}
            type="number"
            onChange={handleBNBInputChange}
            mobileWidth="200px"
            mobilePadding="10px"
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
            mobilePadding="10px"
            mobileFontSize="12px"
            onClick={buy}
            disabled={bnbAmount <= 0 || !bnbAmount}
          >
            {buyLoading ? <Spinner border="3px solid #f3f3f3" /> : "Buy"}
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
            mobileFontSize="20px"
            mobilePadding="0px 2px 0px 2px"
          >
            {daysLeft}
          </SpanText>
          <SpanText
            fontSize="15px"
            mobileFontSize="10px"
            fontWeight="normal"
            color="#ffffff"
          >
            days
          </SpanText>
          <SpanText
            fontSize="34px"
            fontWeight="bold"
            color="#1642fa"
            padding="1px 4px 1px 4px"
            mobileFontSize="20px"
            mobilePadding="0px 2px 0px 2px"
          >
            {hoursLeft}
          </SpanText>
          <SpanText
            fontSize="15px"
            mobileFontSize="10px"
            fontWeight="normal"
            color="#ffffff"
          >
            hours
          </SpanText>
          <SpanText
            fontSize="34px"
            fontWeight="bold"
            color="#1642fa"
            padding="1px 4px 1px 4px"
            mobileFontSize="20px"
            mobilePadding="0px 2px 0px 2px"
          >
            {minutesLeft}
          </SpanText>
          <SpanText
            fontSize="15px"
            mobileFontSize="10px"
            fontWeight="normal"
            color="#ffffff"
          >
            minutes
          </SpanText>
          <SpanText
            fontSize="34px"
            fontWeight="bold"
            color="#1642fa"
            padding="1px 4px 1px 4px"
            mobileFontSize="20px"
            mobilePadding="0px 2px 0px 2px"
          >
            {secondsLeft}
          </SpanText>
          <SpanText
            fontSize="15px"
            mobileFontSize="10px"
            fontWeight="normal"
            color="#ffffff"
          >
            seconds
          </SpanText>
        </DivInCenterFlex>
      </CenterFlex>
      <Toast isErrorToast={errorToast} isShown={showToast}>
        {errorToast ? (
          <SpanText
            fontSize="14px"
            fontWeight="normal"
            color="white"
            padding="1px 4px 1px 4px"
          >
            {toastMessage}
          </SpanText>
        ) : (
          <div>
            <SpanText
              fontSize="14px"
              fontWeight="bold"
              color="white"
              padding="1px 4px 1px 4px"
            >
              {toastMessage}
            </SpanText>{" "}
            <AnchorLink
              href={`${explorer}${txHash}`}
              fontSize="14px"
              fontWeight="bold"
              color="#ffffff"
              padding="2px 6px 2px 6px"
            >
              View on explorer
            </AnchorLink>
          </div>
        )}
      </Toast>
      <CenterFlex marginTop="30px" padding="3px">
        <Image
          borderRadius="50%"
          src={logo}
          width="20px"
          height="20px"
          alt="XOXCASH Logo"
        />
      </CenterFlex>
      <CenterFlex marginTop="4px" padding="4px">
        <SpanText fontSize="15px" fontWeight="normal" color="#ffffff">
          Copyright @ 2021 XOXCASH
        </SpanText>
      </CenterFlex>
    </div>
  );
};

export default Home;
