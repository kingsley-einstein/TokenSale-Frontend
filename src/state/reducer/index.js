const reducer = (state, action) => {
  switch (action.type) {
    case "WEB3_INJECTED":
      return {
        ...state,
        provider: action.payload
      };
    case "ACCOUNT_SET":
      return {
        ...state,
        account: action.payload
      };
    case "RATE_SET":
      return {
        ...state,
        rate: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
