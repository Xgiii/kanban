import { MongoClient } from 'mongodb';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    secret: process.env.NEXTAUTH_SECRET,
    async signIn({ user }: any) {
      const client = await MongoClient.connect(
        process.env.MONGODB_URI as string
      );
      const usersCol = client.db().collection('users');

      const userInDb = await usersCol.findOne({ email: user.email });
      if (userInDb) {
        return true;
      }
      await usersCol.insertOne({
        name: user.name,
        email: user.email,
        image: user.image,
      });
      return true;
    },
    async session({ session }: any) {
      const client = await MongoClient.connect(
        process.env.MONGODB_URI as string
      );
      const usersCol = client.db().collection('users');

      const userInDb = await usersCol.findOne({ email: session.user.email });

      session.user._id = userInDb?._id;
      return session;
    },
  },
};

export default NextAuth(authOptions);
