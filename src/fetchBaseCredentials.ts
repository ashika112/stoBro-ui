import { AWSTemporaryCredentials } from "@aws-amplify/storage/internals";
import { APIGW_URL } from "./secrets.ts";

export const fetchBaseCredentials = async (
  token: string
): Promise<AWSTemporaryCredentials | void> => {
  try {
    // console.log("idToken", token);
    const response = await fetch(`${APIGW_URL}?idToken=${token}`, {
      method: "GET",
    });

    const data = await response.json();
    // console.log("data", await JSON.parse(data.body));

    const {
      AccessKeyId: accessKeyId,
      SecretAccessKey: secretAccessKey,
      SessionToken: sessionToken,
      Expiration: expiration,
    } = await JSON.parse(data.body);

    const baseCreds = {
      accessKeyId,
      secretAccessKey,
      sessionToken,
      expiration,
    };
    return baseCreds;
  } catch (e) {
    console.error(e);
  }
};
