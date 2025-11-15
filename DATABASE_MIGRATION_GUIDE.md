# Database Migration Guide - Industry Best Practices

## The Problem You Identified

You're absolutely right - manually syncing database changes between dev and prod is:
- ❌ Dangerous
- ❌ Error-prone
- ❌ Not scalable
- ❌ No audit trail
- ❌ Hard to rollback

## The Solution: Database Migrations

**Migrations** are version-controlled SQL files that describe database changes over time.

### How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Developer  │────>│  Migration   │────>│   Test in    │────>│  Apply to    │
│ Makes Change│     │  File (.sql) │     │     Dev      │     │     Prod     │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                           │
                           v
                    ┌──────────────┐
                    │ Git Version  │
                    │   Control    │
                    └──────────────┘
```

## Your Migration Workflow

### 1. Making Database Changes (Development)

**ALWAYS follow this process:**

```bash
# Step 1: Create a new migration file
supabase migration new add_new_table

# This creates: supabase/migrations/20231115123456_add_new_table.sql
```

**Step 2: Write your SQL in the migration file**

```sql
-- supabase/migrations/20231115123456_add_new_table.sql
CREATE TABLE public.new_table (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view new_table" ON public.new_table
  FOR SELECT USING (true);
```

**Step 3: Test locally (optional but recommended)**

```bash
# Start local Supabase (Docker required)
supabase start

# Apply migrations locally
supabase db reset
```

**Step 4: Apply to Development Database**

```bash
# Link to your dev project (one-time setup)
supabase link --project-ref seiwhmnvyrrhqkglovwo

# Push migration to dev
supabase db push
```

**Step 5: Test your application with the changes**

**Step 6: Commit the migration file to git**

```bash
git add supabase/migrations/
git commit -m "feat: add new_table for feature X"
```

**Step 7: When deploying to production**

```bash
# Link to prod project
supabase link --project-ref pweigtkozqgybekvadaz

# Push migration to prod
supabase db push
```

### 2. Quick Reference Commands

```bash
# Create a new migration
supabase migration new <description>

# Link to a Supabase project
supabase link --project-ref <project-ref>

# Push migrations to linked project
supabase db push

# Pull schema changes from remote (if someone else made changes)
supabase db pull

# View migration status
supabase migration list

# Generate migration from current schema differences
supabase db diff --use-migra | supabase migration new <name>
```

### 3. Fixing Your Current Situation

Since you already made manual changes, let's create a baseline migration:

```bash
# 1. Link to production (source of truth)
supabase link --project-ref pweigtkozqgybekvadaz

# 2. Pull the current production schema
supabase db pull

# This creates a migration file with your current prod schema

# 3. Now apply it to dev to ensure they match
supabase link --project-ref seiwhmnvyrrhqkglovwo
supabase db push

# 4. Commit the baseline migration
git add supabase/migrations/
git commit -m "chore: add baseline database schema migration"
```

## Benefits of This Approach

✅ **Version Control** - All schema changes are tracked in git
✅ **Reproducible** - Anyone can recreate the database state
✅ **Auditable** - You know who changed what and when
✅ **Rollback-able** - Can revert changes if needed
✅ **Safe** - Test in dev before applying to prod
✅ **Automated** - Can integrate into CI/CD pipelines
✅ **Team-friendly** - Multiple developers can work together

## Common Workflows

### Scenario 1: Adding a New Column

```bash
# Create migration
supabase migration new add_email_to_users

# Edit the file: supabase/migrations/[timestamp]_add_email_to_users.sql
ALTER TABLE public.users ADD COLUMN email text;

# Apply to dev
supabase link --project-ref seiwhmnvyrrhqkglovwo
supabase db push

# Test your app

# Commit
git add supabase/migrations/
git commit -m "feat: add email column to users"

# Deploy to prod (when ready)
supabase link --project-ref pweigtkozqgybekvadaz
supabase db push
```

### Scenario 2: Creating a New Table

```bash
# Create migration
supabase migration new create_comments_table

# Write SQL in migration file
# Apply to dev, test, commit, then push to prod (same as above)
```

### Scenario 3: Modifying RLS Policies

```bash
# Create migration
supabase migration new update_posts_rls_policy

# Edit migration file
DROP POLICY IF EXISTS "old_policy_name" ON public.posts;
CREATE POLICY "new_policy_name" ON public.posts
  FOR SELECT USING (auth.uid() = author_id);

# Apply to dev, test, commit, push to prod
```

## Integration with Your Workflow

### In Your CI/CD Pipeline

You can automate migrations in your deployment process:

```yaml
# Example GitHub Actions workflow
- name: Run database migrations
  run: |
    supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    supabase db push
  env:
    SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## Important Notes

1. **Never edit old migration files** - Always create new ones
2. **Test migrations in dev first** - Never apply untested migrations to prod
3. **Keep migrations small** - One logical change per migration
4. **Write reversible migrations** - Think about rollback scenarios
5. **Commit migrations to git** - They're part of your codebase
6. **Document complex migrations** - Add comments explaining why

## What NOT To Do

❌ Don't make manual changes in Supabase dashboard (production)
❌ Don't edit the database directly with SQL queries (production)
❌ Don't skip testing migrations in dev
❌ Don't forget to commit migration files
❌ Don't apply different changes to dev and prod

## Tools & Alternatives

### Supabase CLI (Recommended for your stack)
- Built-in migration support
- Works with your existing Supabase setup
- Version controlled SQL files

### Other Popular Tools:
- **Prisma Migrate** - If using Prisma ORM
- **TypeORM Migrations** - If using TypeORM
- **Knex.js** - For Node.js projects
- **Flyway** - Java/Enterprise
- **Liquibase** - Enterprise-grade

## Next Steps for Your Project

1. ✅ Supabase is initialized
2. ⏭️ Create a baseline migration (see section 3 above)
3. ⏭️ From now on, ALWAYS use migrations for schema changes
4. ⏭️ Document this process for your team
5. ⏭️ Consider adding migration checks to your PR process

## Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Database Migration Best Practices](https://www.prisma.io/dataguide/types/relational/migration-strategies)
- [Martin Fowler on Evolutionary Database Design](https://martinfowler.com/articles/evodb.html)

---

**Remember**: The migration file is the source of truth, not the database itself!
