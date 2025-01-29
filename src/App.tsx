import {
  createManagedAuthAdapter,
  createStorageBrowser,
} from "@aws-amplify/ui-react-storage/browser";

import "@aws-amplify/ui-react-storage/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";
import { fetchAuthSession } from "aws-amplify/auth";
import { fetchBaseCredentials } from "./fetchBaseCredentials";
import { ACCOUNT_ID, AWS_REGION } from "./secrets";

const authSess = async () => {
  const { tokens: { idToken } = {} } = await fetchAuthSession({
    forceRefresh: true,
  });

  if (!idToken) throw new Error("Unable to signIn and fetch TTI token");

  const creds = await fetchBaseCredentials(idToken.toString());
  if (!creds) throw new Error("Unable to fetch IAM IDC credentials");

  return creds;
};

export const { StorageBrowser } = createStorageBrowser({
  config: createManagedAuthAdapter({
    accountId: ACCOUNT_ID,
    region: AWS_REGION,
    credentialsProvider: async () => {
      const creds = await authSess();
      return {
        credentials: creds,
      };
    },
    registerAuthListener: () => {},
  }),
});

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user!.username}</h1>

          <StorageBrowser />
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
