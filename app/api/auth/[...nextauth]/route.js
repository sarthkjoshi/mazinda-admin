import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone_number: {
          label: "Phone Number",
          type: "text",
          placeholder: "Enter your phone number",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied

        // const { data } = await axios.post("/api/user/fetch-admin", {
        //   phone_number: credentials.phone_number,
        //   password: credentials.password,
        // });

        const user = await User.findOne({
          phoneNumber: credentials.phone_number,
          password: credentials.password,
        });

        if (user) {
          console.log(user);
          // Any object returned will be saved in `user` property of the JWT
          return {
            phoneNumber: user.phoneNumber,
          };
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
