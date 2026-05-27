import { betterAuth } from "better-auth"

export const auth = betterAuth({
    database: {
        // Here you would connect to your database (e.g. SQLite, PostgreSQL, etc)
        // For demonstration purposes, we are just mocking the structure.
        provider: "sqlite",
        url: ":memory:"
    },
    emailAndPassword: {
        enabled: true,
    },
});