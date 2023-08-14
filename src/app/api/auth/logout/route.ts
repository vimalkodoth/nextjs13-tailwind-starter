import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    var url = `${process.env.END_SESSION_URL}`;

    console.log(`[Logout] ${url} with ${`Bearer ${session.access_token}`}`);
    try {
      const resp = await fetch(url, {
        method: "GET",
        headers: { Authentication: `Bearer ${session.access_token}` },
      });
    } catch (err) {
      console.error(err);
      return new Response({ status: 500 });
    }
  }
  return new Response({ status: 200 });
}
