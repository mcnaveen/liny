## Generate GitHub Secrets

1. Go to the [GitHub -> Settings -> Developer settings -> OAuth Apps](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the required fields:
   - Application name: "Liny"
   - Homepage URL: "http://localhost:3000"
   - Authorization callback URL: "http://localhost:3000/api/auth/callback/github"
4. Click on "Register application"
5. Copy the "Client ID"

6. Click on "Generate a new client secret"
7. Copy the "Client Secret"

- If you're using a different port, make sure to update the callback URL.
- If you're running the app in production, make sure to update the homepage URL and callback URL to `https://YOURDOMAIN.com/api/auth/callback/github`
