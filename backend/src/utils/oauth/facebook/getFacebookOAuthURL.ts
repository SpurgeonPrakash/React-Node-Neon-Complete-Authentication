export const getFacebookOauthURL = ({
  appID,
  appRedirectURI,
}: {
  appID: string;
  appRedirectURI: string;
}) =>
  `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appID}&redirect_uri=${appRedirectURI}&scope=email`;
