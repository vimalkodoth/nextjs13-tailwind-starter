import NextAuth from "next-auth";
import jwt_decode from "jwt-decode";

// this will refresh an expired access token, when needed
async function refreshAccessToken(token) {
  const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: token.refresh_token,
    }),
    method: "POST",
  });
  const refreshToken = await resp.json();
  if (!resp.ok) throw refreshToken;
  return {
    ...token,
    access_token: refreshToken.access_token,
    decoded: jwt_decode(refreshToken.access_token),
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}

export const authOptions = {
  useSecureCookies: false,
  providers: [
    {
      id: "my_iam",
      name: "my_iam",
      type: "oauth",
      wellKnown: "https://iam.sci-dev.live/.well-known/openid-configuration",
      idToken: false,
      issuer: "https://iam.sci-dev.live/",
      authorization: "https://iam.sci-dev.live",
      token: "https://iam.sci-dev.live/signin/token",
      userinfo: "https://iam.sci-dev.live/v1/me/profile",
      profileUrl: "https://iam.sci-dev.live/v1/me/profile",
      async profile(profile, tokens) {
        // You can use the tokens, in case you want to fetch more profile information
        // For example several OAuth providers do not return email by default.
        // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      clientId: "X93j7fMcGTrNvf1SJRbnu37yrTgAa4zT",
      clientSecret: "2kEhgM7lidHan0iH4Ds4J1BTmQ6aRT7u",
    },
  ],
  debug: true,
  callbacks: {
    async jwt({ token, account }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);
      if (account) {
        //account is only available the first time this callback is called on a new session (after the user signs in)
        token.decoded = jwt_decode(account.access_token);
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      } else if (nowTimeStamp < token.expires_at) {
        // token has not expired yet, return it
        return token;
      } else {
        // token is expired, try to refresh it
        console.log("Token has expired. Will refresh...");
        try {
          const refreshedToken = await refreshAccessToken(token);
          console.log("Token is refreshed.");
          return refreshedToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token }) {
      // Send properties to the client
      session.access_token = token.access_token; // see utils/sessionTokenAccessor.js
      session.error = token.error;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
