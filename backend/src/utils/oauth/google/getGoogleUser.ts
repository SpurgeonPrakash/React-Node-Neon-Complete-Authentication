import axios from "axios";
import oAuthClient from "./oAuthClient.js";

const getAccessAndBearerTokenUrl = ({
  accessToken,
}: {
  accessToken: string | null | undefined;
}) =>
  `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${accessToken}`;

type Code = { code: string | null };

export const getGoogleUser = async ({ code }: Code) => {
  const { tokens } = await oAuthClient.getToken(code as string);
  const response = await axios.get(
    getAccessAndBearerTokenUrl({ accessToken: tokens.access_token }),
    { headers: { Authorization: `Bearer ${tokens.id_token}` } },
  );
  return response.data;
};
