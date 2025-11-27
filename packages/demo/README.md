# Convex Analytics Demo

This is a demo app that demonstrates how to use the [Convex Analytics](https://github.com/raideno/convex-analytics) package.

Before running the demo, make sure the following environment variables are configured in your convex project:

```bash
npx convex env set JWKS "<your-jwks>"
npx convex env set JWT_PRIVATE_KEY "<your-jwt-private-key>"
npx convex env set SITE_URL "http://localhost:5173"
```

The `JWKS` and `JWT_PRIVATE_KEY` can be generated using by following the [Convex Auth Documentation](https://labs.convex.dev/auth/setup/manual#configure-private-and-public-key).
