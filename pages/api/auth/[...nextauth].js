import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const generateRandomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateNextAuthSecret = () => {
  // Generate a random string of length 64
  return generateRandomString(64);
};

let adminEmails = [];

(async () => {
  const client = await clientPromise;
  const db = client.db();
  const adminsCollection = db.collection("admins");
  const admins = await adminsCollection.find({}).toArray();
  adminEmails = admins.map((admin) => admin.email);
})();

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || generateNextAuthSecret(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      redirectUri: "https://vape-me-admin.netlify.app/api/auth/callback/google",
      //allowDangerousEmailAccountLinking: true,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn(user) {
      if (adminEmails.includes(user.user.email)) {
        return true;
      } else {
        return false;
      }
    },
    async session({ session, token, user }) {
      if (adminEmails.includes(user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    res.status(401);
    res.end();
    throw "not authenticated";
  }

  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401);
    res.end();
    throw "not an admin";
  }
}
