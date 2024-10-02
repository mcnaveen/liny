## Guide to using Supabase as your database

### Setting up Supabase

1. Go to [Supabase](https://supabase.com/) and sign up for an account.
2. If you're prompted to choose an organization, select the default organization.
3. Now, Click on the "New Project" button.
4. Enter the project details:
   - Project Name: "Liny"
   - Database Password: SOMETHINGSECURE (replace with a secure password)
   - Region: "us-east-1" (or closest to you)
5. Click on the "Create Project" button.
6. Once the project is created, you will be redirected to the project dashboard.
7. Click on the green color "Connect" button.
8. A modal will appear. Click on the "Connection String" tab.
9. Copy the connection string.
10. Open the `.env` file and paste the connection string into the `DATABASE_URL` variable.
11. Replace the port `6543` with `5432`.
12. Password is the one you chose in step 4.
13. Now run `npx prisma db push` to create the tables.

---

That's it! You've successfully set up Supabase as your database.
