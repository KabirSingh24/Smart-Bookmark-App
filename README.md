# 🚀 Smart Bookmark App

A modern, real-time, multi-user bookmark manager built with Next.js App Router, Supabase, and Tailwind CSS.

Users can log in using Google OAuth, add bookmarks, delete their own bookmarks, and see real-time updates across multiple tabs.

---

## ✨ Features

- 🔐 Google OAuth Authentication
- 👤 Multi-user support (each user sees only their own bookmarks)
- ⚡ Real-time updates across browser tabs
- ➕ Add bookmarks
- ❌ Delete bookmarks
- 📱 Fully responsive design
- 🚀 Deploy-ready for Vercel
- 🔒 Secure with Row Level Security (RLS)

---

## 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## 📦 Project Structure

```
smart-bookmark/
│
├── app/
│   ├── page.tsx                # Login Page
│   └── dashboard/
│       └── page.tsx            # Dashboard Page
│
├── lib/
│   └── supabase.ts             # Supabase Client
│
├── .env.local                  # Environment Variables
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/smart-bookmark.git
cd smart-bookmark
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Copy:
   - Project URL
   - Anon Public Key

---

### 4️⃣ Setup Environment Variables

Create a file:

```
.env.local
```

Add:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

### 5️⃣ Create Database Table

Go to Supabase → Table Editor → Create Table

Table Name: `bookmarks`

Columns:

| Column Name | Type      | Settings                     |
|------------|----------|------------------------------|
| id         | uuid     | Primary Key, Default: uuid_generate_v4() |
| title      | text     | Not Null                     |
| url        | text     | Not Null                     |
| user_id    | uuid     | Not Null                     |
| created_at | timestamptz | Default: now()          |

---

## 🔒 Enable Row Level Security (IMPORTANT)

Enable RLS on the `bookmarks` table.

Create these policies:

### SELECT Policy

```sql
create policy "Users can read own bookmarks"
on public.bookmarks
for select
to public
using (auth.uid() = user_id);
```

### INSERT Policy

```sql
create policy "Users can insert own bookmarks"
on public.bookmarks
for insert
to public
with check (auth.uid() = user_id);
```

### DELETE Policy

```sql
create policy "Users can delete own bookmarks"
on public.bookmarks
for delete
to public
using (auth.uid() = user_id);
```

---

## 🔑 Enable Google OAuth

1. Go to Supabase → Authentication → Providers
2. Enable Google
3. Add Redirect URL:

```
https://your-project-id.supabase.co/auth/v1/callback
```

4. Create OAuth credentials in Google Cloud Console
5. Paste Client ID and Secret into Supabase

---

## ⚡ Enable Realtime

1. Go to Supabase Dashboard
2. Enable Realtime in project settings
3. Enable Realtime for the `bookmarks` table

---

## ▶️ Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🚀 Deploy to Vercel

1. Push project to GitHub
2. Import project into Vercel
3. Add Environment Variables in Vercel:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Redeploy

---

## 🧠 How It Works

- User logs in via Google OAuth
- Supabase creates a user session
- Each bookmark is stored with a `user_id`
- Row Level Security ensures:
  - Users can only read their own bookmarks
  - Users can only insert their own bookmarks
  - Users can only delete their own bookmarks
- Supabase Realtime syncs changes across browser tabs instantly

---

## 🔐 Security

- No user can see another user’s bookmarks
- Data isolation handled by Supabase RLS
- Public anon key is safe (security enforced by policies)

---

## 📱 Responsive Design

- Mobile-first layout
- Clean card UI
- Adaptive header and bookmark list

---

## 🎯 Final Result

Smart Bookmark App is:

- Secure
- Real-time
- Multi-user safe
- Fully responsive
- Production ready

---

## 👨‍💻 Author

Built with ❤️ using Next.js and Supabase.

---