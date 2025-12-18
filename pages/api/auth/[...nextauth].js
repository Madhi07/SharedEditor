import { loginApiPath, signUpApiPath } from '@/constants/apiPaths';
import NextAuth from 'next-auth';
import Google from "next-auth/providers/google"
import Credentials from 'next-auth/providers/credentials';

export const authOptions = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            name: 'Agentzee AI',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'jsmith@example.com',
                },
                password: { label: 'Password', type: 'password' },
                first_name: {
                    label: 'First Name',
                    type: 'text',
                    placeholder: 'John'
                },
                last_name: {
                    label: 'Last Name',
                    type: 'text',
                    placeholder: 'Doe'
                },
                phone: {
                    label: 'Phone',
                    type: 'text',
                    placeholder: '9876543210'
                },
                country_code: {
                    type: 'text',
                    placeholder: '+91'
                },

            },
            async authorize(credentials, req) {
                let payload = {
                    email: credentials.email,
                    password: credentials.password,
                };
                let apiPath = loginApiPath;

                if (credentials?.type === "sign-up") {
                    payload.first_name = credentials.first_name;
                    payload.last_name = credentials.last_name;
                    payload.phone = credentials.phone;
                    payload.country_code = credentials.country_code;
                    apiPath = signUpApiPath;
                }
                console.log(`${process.env.API_URL}${apiPath}`)
                const res = await fetch(`${process.env.API_URL}${apiPath}`, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    let user = {}
                    try {
                        user = await res.json();
                    }
                    catch (e) { }
                    throw new Error(JSON.stringify({
                        message: user?.message,
                        status: res?.status
                    }));
                }
                // If no error and we have user data, return it
                if (res.ok) {
                    const user = await res.json();
                    return { ...user, provider: "email" };
                }

                // Return null if user data could not be retrieved
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
            if (trigger === "update" && session?.user) {
                token = {
                    ...token,
                    ...session.user
                }
            }
            return {
                ...token,
                ...user,
                ...account
            }

        },

        async session({ session, token }) {
            session.user = { ...token };
            return session;
        },
    },
    theme: {
        colorScheme: 'auto',
        brandColor: '#6E3AFF',
        logo: `${process.env.NEXTAUTH_URL}/agentzee-face-color.png`,
    },
    debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);