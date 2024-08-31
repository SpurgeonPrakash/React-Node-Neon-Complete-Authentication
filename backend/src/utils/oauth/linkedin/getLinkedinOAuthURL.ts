export const getLinkedinOauthURL = ({
  clientId,
  appRedirectURI,
}: {
  clientId: string;
  appRedirectURI: string;
}) =>
  `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${appRedirectURI}&scope=openid,profile,email`;
