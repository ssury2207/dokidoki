# Quick Setup: Database Migrations for dokidoki

## One-Time Setup (Do This Now)

### Step 1: Get Your Supabase Access Token

1. Go to https://app.supabase.com/account/tokens
2. Click "Generate new token"
3. Give it a name (e.g., "dokidoki-migrations")
4. Copy the token
5. Set it as an environment variable:

```bash
export SUPABASE_ACCESS_TOKEN=your_token_here

# Or add to your ~/.zshrc or ~/.bashrc:
echo 'export SUPABASE_ACCESS_TOKEN=your_token_here' >> ~/.zshrc
source ~/.zshrc
```

### Step 2: Create Baseline Migration from Production

```bash
# 1. Link to production (your source of truth)
supabase link --project-ref pweigtkozqgybekvadaz

# 2. Pull the current schema into a migration file
supabase db pull

# This creates: supabase/migrations/[timestamp]_remote_schema.sql
```

### Step 3: Verify Both Databases Are in Sync

```bash
# Link to dev
supabase link --project-ref seiwhmnvyrrhqkglovwo

# Check if there are any differences
supabase db diff

# If there are differences, push the migration
supabase db push
```

### Step 4: Commit to Git

```bash
git add supabase/
git add DATABASE_MIGRATION_GUIDE.md
git add SETUP_MIGRATIONS.md
git commit -m "chore: add database migration infrastructure"
```

## Daily Workflow (Future Changes)

### When You Need to Change the Database Schema:

```bash
# 1. Create a new migration
supabase migration new describe_your_change

# 2. Edit the generated file in supabase/migrations/
# Add your SQL changes

# 3. Apply to dev database
supabase link --project-ref seiwhmnvyrrhqkglovwo
supabase db push

# 4. Test your application

# 5. Commit the migration
git add supabase/migrations/
git commit -m "feat: describe your change"

# 6. When deploying to production
supabase link --project-ref pweigtkozqgybekvadaz
supabase db push
```

## Quick Commands Cheat Sheet

```bash
# Create new migration
supabase migration new <name>

# Link to dev
supabase link --project-ref seiwhmnvyrrhqkglovwo

# Link to prod
supabase link --project-ref pweigtkozqgybekvadaz

# Apply migrations
supabase db push

# Pull remote schema
supabase db pull

# Check for differences
supabase db diff

# List migrations
supabase migration list
```

## Project References

- **Dev**: `seiwhmnvyrrhqkglovwo`
- **Prod**: `pweigtkozqgybekvadaz`

## What Just Happened?

1. ✅ Initialized Supabase project structure
2. ✅ Created migrations directory
3. ✅ Set up configuration files
4. ⏭️ You need to: Get access token and create baseline migration

## Benefits You'll Get

- 🎯 No more manual schema syncing
- 📝 All changes tracked in git
- 🔄 Easy rollbacks
- 👥 Team members can apply same changes
- 🚀 Can automate in CI/CD

---

See [DATABASE_MIGRATION_GUIDE.md](DATABASE_MIGRATION_GUIDE.md) for detailed documentation.
