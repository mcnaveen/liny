## Development Instructions

### Prerequisites

- Node.js
- Package Manager (pnpm or npm or yarn)
- Git
- Database (PostgreSQL, MySQL or You can use Supabase)
- GitHub OAuth Credentials (Client ID and Client Secret) [Generate GitHub Secrets](./generate-github-secrets.md)

### Setting up the project

1. Go to the [GitHub Releases](https://github.com/mcnaveen/liny/) and Click on the `Fork` button.
2. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/liny.git
   cd liny
   ```

3. Install the dependencies:

   ```bash
   pnpm install
   ```

   > Alternatively, you can use `npm` or `yarn` to install the dependencies.

4. Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

5. Open the `.env` file and fill in the required fields. You can leave the SMTP fields empty if not needed.

| Required Fields        | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `DATABASE_URL`         | You can use local database or Supabase         |
| `NEXTAUTH_SECRET`      | (You can use any random string for this)       |
| `NEXTAUTH_URL`         | (You can use `http://localhost:3000` for this) |
| `NEXT_PUBLIC_APP_URL`  | (You can use `http://localhost:3000` for this) |
| `GITHUB_CLIENT_ID`     | Required to use GitHub OAuth                   |
| `GITHUB_CLIENT_SECRET` | Required to use GitHub OAuth                   |

> (If you're using Supabase, please refer to the [Supabase Setup Guide](./use-supabase.md) and come back. Otherwise, you can use any other database supported by Prisma [MySQL, PostgreSQL, etc.].)

> Refer to [Generate a GitHub Secret](./generate-github-secrets.md) to generate the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

6. If you're self-hosting, set `SELFHOSTED` to `true` in the `.env` file to block other users from creating projects in your instance. (Default is `true`)

7. Run `npx prisma db push` to create the tables.

8. Run `pnpm run dev` to start the development server.
