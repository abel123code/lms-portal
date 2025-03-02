// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectToDB from "@/lib/mongodb";
import User from "@/lib/modal/User";

export const authOptions = ({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // profile(profile) {
      //   console.log("Google profile: ", profile);
      //   return { ...profile };
      // },
    }),
  ],
  // Use JWT-based sessions (no separate session collection needed)
  session: { 
      maxAge: 60 * 60 ,
      strategy: "jwt" 
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToDB();
      let existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // New user -> create in DB with `vetted: false`
        existingUser = await User.create({
          email: user.email,
          name: user.name,
          googleId: account.providerAccountId,
          image: profile.picture,    // Save Google profile picture
          role: "student",
          vetted: false,
        });
      }

      return true; // Vetting done, allow sign in
    },

    async session({ session }) {
      // By default, NextAuth includes user.email, user.name, etc.
      if (!session.user) return session;

      await connectToDB();
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.id = dbUser._id.toString();
        session.user.role = dbUser.role;
        session.user.vetted = dbUser.vetted;
        session.user.image = dbUser.image;  // Put DB-stored image into session
      }
      return session;
    },

    async jwt({ token, user, account, profile }) {
      // 1) On initial sign-in, user & profile are available
      // 2) On subsequent requests, only token is available
      await connectToDB();

      if (user) {
        // "user" is the object returned by the "signIn" callback
        // which is basically what NextAuth merges from your DB + provider
        const dbUser = await User.findOne({ email: user.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.vetted = dbUser.vetted;
          token.image = dbUser.image;  // store the user’s avatar in JWT
          token.googleId = dbUser.googleId; 
        }
      } else if (token.email) {
        // For subsequent calls
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.vetted = dbUser.vetted;
          token.image = dbUser.image;
          token.googleId = dbUser.googleId;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/no-access",
  },
  secret: process.env.NEXTAUTH_SECRET, // used to sign JWT
});

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
