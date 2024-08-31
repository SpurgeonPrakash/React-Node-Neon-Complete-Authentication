export const getGithubOauthURL = ({ appID }: { appID: string }) =>
  `https://github.com/login/oauth/authorize?client_id=${appID}`;
