# 🗄️ How to Start/Check Database on Render

Render PostgreSQL databases are **always running** - they don't need to be "started" like Docker containers.

However, they can be in different states. Let's troubleshoot!

---

## Check Database Status

### Step 1: Go to Render Dashboard

1. Visit: https://dashboard.render.com
2. Look at your services list
3. Find your PostgreSQL database

### Step 2: Check Database Status

Your database can be in these states:

**🟢 Available** - Database is running and ready
- Good to go!

**🟡 Creating** - Database is being created
- Wait 2-5 minutes

**🔴 Suspended** - Free tier database suspended (after 90 days of inactivity)
- Need to restore or recreate

**🟠 Failed** - Creation failed
- Check error logs and recreate

---

## If Database is "Available" but Backend Can't Connect

### Problem: Wrong Connection Settings

Your backend needs the **Internal Database URL**, not the external one!

### Fix: Get Correct Credentials

1. Click on your PostgreSQL database service
2. Go to "**Info**" tab
3. Look for "**Connections**" section
4. Find "**Internal Database URL**"

You'll see something like:
```
postgresql://beskydy_user:XXXXXX@dpg-xxxxx-a/beskydy_db
```

**Parse this URL:**
```
postgresql://[USERNAME]:[PASSWORD]@[HOSTNAME]/[DATABASE]
```

Example:
```
postgresql://beskydy_user:abcd1234@dpg-abc123-a.frankfurt-postgres.render.com/beskydy_db
```

Becomes:
```
DB_HOST = dpg-abc123-a.frankfurt-postgres.render.com
DB_PORT = 5432
DB_USER = beskydy_user
DB_PASSWORD = abcd1234
DB_NAME = beskydy_db
```

### Update Your Backend Environment Variables

1. Go to your Web Service (backend)
2. Click "**Environment**" (or Settings → Environment Variables)
3. Update these values with credentials from above:

```
DB_HOST = dpg-xxxxx-a.frankfurt-postgres.render.com
DB_PORT = 5432
DB_USER = beskydy_user
DB_PASSWORD = (from Internal Database URL)
DB_NAME = beskydy_db
```

4. Click "**Save Changes**"
5. Backend will auto-redeploy

---

## If Database Doesn't Exist

### Create a New PostgreSQL Database

1. In Render Dashboard, click "**New +**"
2. Select "**PostgreSQL**"
3. Configure:

```
Name: beskydy-postgres
Database: beskydy_db
User: beskydy_user
Region: Frankfurt (or closest to you)
PostgreSQL Version: 15
Instance Type: Free
```

4. Click "**Create Database**"
5. Wait 3-5 minutes for creation

### Initialize the Database Schema

After database is created, you need to add tables:

1. Get PSQL connection command from database "**Connect**" tab
2. Copy the PSQL command (looks like this):

```bash
PGPASSWORD=xxxx psql -h dpg-xxxxx-a.frankfurt-postgres.render.com -U beskydy_user beskydy_db
```

3. On your local machine, modify it to run the schema file:

```bash
PGPASSWORD=your-password psql -h dpg-xxxxx-a.frankfurt-postgres.render.com -U beskydy_user beskydy_db < backend/database/schema.sql
```

4. You should see:
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
...
INSERT 0 5
INSERT 0 6
...
```

5. Verify it worked:

```bash
PGPASSWORD=your-password psql -h dpg-xxxxx-a.frankfurt-postgres.render.com -U beskydy_user beskydy_db -c "SELECT COUNT(*) FROM accommodation;"
```

Should return: `5` (or number of accommodation entries)

---

## If Database is Suspended (90-Day Free Tier)

Render free databases suspend after **90 days of inactivity**.

### Option 1: Restore from Backup (Paid Plans Only)
- Free tier doesn't have backups
- Skip to Option 2

### Option 2: Recreate Database

1. Delete the old database
2. Create a new one (see "Create a New PostgreSQL Database" above)
3. Initialize with schema.sql

---

## Quick Database Check

From your local terminal:

```bash
# Test connection (replace with your credentials)
PGPASSWORD=your-password psql -h your-hostname.render.com -U beskydy_user beskydy_db -c "SELECT version();"
```

**Success:** Shows PostgreSQL version
```
PostgreSQL 15.x on x86_64-pc-linux-gnu
```

**Failed:** Connection error
```
psql: error: connection to server at "..." failed
```

If failed:
- Check hostname is correct (internal, not external)
- Check password is correct
- Check database exists in Render dashboard

---

## Common Issues

### Issue: "Connection refused"

**Cause:** Using external URL instead of internal URL

**Fix:** Use Internal Database URL from Render dashboard

### Issue: "Password authentication failed"

**Cause:** Wrong password in environment variables

**Fix:** Copy exact password from Internal Database URL

### Issue: "Database does not exist"

**Cause:** Database wasn't created or was deleted

**Fix:** Create new database on Render

### Issue: "Relation does not exist"

**Cause:** Database exists but no tables (schema not initialized)

**Fix:** Run schema.sql:
```bash
PGPASSWORD=pass psql -h host -U user db < backend/database/schema.sql
```

---

## Verify Everything Works

### 1. Database is Running
Check Render dashboard → PostgreSQL → Status = "Available"

### 2. Connection Works
```bash
PGPASSWORD=pass psql -h host -U user db -c "SELECT 1;"
```

### 3. Tables Exist
```bash
PGPASSWORD=pass psql -h host -U user db -c "\dt"
```
Should show 7 tables.

### 4. Data Exists
```bash
PGPASSWORD=pass psql -h host -U user db -c "SELECT COUNT(*) FROM users;"
```
Should return at least 2 (admin + user).

### 5. Backend Connects
```bash
curl https://your-backend.onrender.com/api/health
```
Should return:
```json
{"status":"OK","database":{"status":"connected"}}
```

---

## TL;DR - Quick Checklist

- [ ] Database shows "Available" in Render dashboard
- [ ] Used **Internal** Database URL (not external)
- [ ] Backend environment variables have correct DB credentials
- [ ] Database initialized with schema.sql
- [ ] Backend can connect (check /api/health)

---

**Still having issues?** Check your backend logs in Render dashboard for the exact error message.
