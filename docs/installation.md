# Installation Instructions

Follow these steps to set up and run the Liny project:

1. Clone the repository:

   ```bash
   git clone https://github.com/mcnaveen/liny.git
   cd liny
   ```

2. Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and fill in the required fields. You can leave the SMTP fields empty if not needed.

3. If you're self-hosting, set `SELFHOSTED` to `true` in the `.env` file to block other users from creating projects.

4. Install dependencies using your preferred package manager. For pnpm:

   ```bash
   pnpm install
   ```

   Alternatively, you can use npm or yarn.

5. Set up the database:

   ```bash
   npx prisma db push
   ```

6. Build the project:

   ```bash
   pnpm build
   ```

7. Start the application:
   ```bash
   pnpm start
   ```

Your Liny instance should now be up and running!

---

### Self-hosting on Vercel with Supabase

1. Fork the repository on GitHub to your own account.

2. Clone your forked repository to your local machine:

   ```bash
   git clone https://github.com/YOUR_USERNAME/liny.git
   cd liny
   ```

3. Copy the example environment file and configure it:

   ```bash
   cp .env.example .env
   ```

   Open the `.env` file and fill in the required fields. You can leave the SMTP fields empty if not needed.

4. If you're self-hosting, set `SELFHOSTED` to `true` in the `.env` file to block other users from creating projects.

5. Install dependencies using your preferred package manager. For pnpm:

   ```bash
   pnpm install
   ```

   Alternatively, you can use npm or yarn.

6. Set up the database:

   ```bash
   npx prisma db push
   ```

7. Redeploy your application on Vercel:
   - Go to your Vercel dashboard.
   - Click on "New Project" and select your forked repository.
   - Follow the prompts to deploy your application.

Your Liny instance should now be up and running on Vercel!

## Notes

- This project uses Next.js and Prisma.
- Make sure you have Node.js and your chosen package manager (pnpm, npm, or yarn) installed on your system before starting the installation process.
- If you encounter any issues during installation, please check the project's documentation or open an issue on the GitHub repository.
