import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const flow = params.flow as string | undefined;
        if (flow === 'signUp' || flow === 'reset' || flow === 'reset-verification') {
          throw new Error('Password registration is disabled. Use provisioned admin accounts.');
        }

        const email = String(params.email ?? '')
          .trim()
          .toLowerCase();
        if (!email) {
          throw new Error('Email is required');
        }

        const profile: { email: string; name?: string } = { email };
        if (params.name) profile.name = String(params.name);
        return profile;
      },
    }),
  ],
});
