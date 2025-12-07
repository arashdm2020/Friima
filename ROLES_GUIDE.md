# 👥 FARIIMA User Roles Guide

## نقش‌های کاربری

### 🎯 دو نقش اصلی:

---

## 1️⃣ Client (کارفرما)

### تعریف:
کسی که پروژه دارد و می‌خواهد فریلنسر استخدام کند.

### قابلیت‌های مخصوص:
```
✅ ایجاد پروژه
✅ مشاهده درخواست‌های freelancers
✅ قبول/رد proposals
✅ چت با freelancer (بعد از accept)
✅ واریز به Escrow
✅ Release payment
✅ رای دادن در Disputes
```

### فیلدهای پروفایل:
```typescript
{
  role: 'client',
  full_name: string,
  email: string,
  company_name?: string,
  bio: string,
  location: string,
  website?: string,
  avatar: string,
  verified: boolean, // تاییدیه
  total_projects: number,
  completed_projects: number,
  rating: number
}
```

### Dashboard:
```
📊 Dashboard های کلاینت:
├── My Posted Projects
├── Active Projects
├── Find Freelancers
├── Messages
├── Payments & Escrow
└── Profile Settings
```

### نمونه Workflow:
```
1. ایجاد پروژه
   └─> تعیین بودجه، مدت، تخصص‌ها

2. دریافت Proposals
   └─> مشاهده قیمت، زمان، cover letter

3. انتخاب Freelancer
   └─> Accept → Chat باز می‌شود

4. واریز به Escrow
   └─> Lock کردن وجه

5. کار انجام می‌شود
   └─> ارتباط از طریق چت

6. بررسی تحویل
   └─> Accept → Release payment
   └─> یا Request Revision
   └─> یا Open Dispute

7. Rating & Review
```

---

## 2️⃣ Freelancer (فریلنسر)

### تعریف:
کسی که دنبال پروژه است و می‌خواهد کار کند.

### قابلیت‌های مخصوص:
```
✅ جستجوی پروژه‌ها
✅ Apply به projects
✅ چت با client (بعد از accept)
✅ تحویل کار
✅ دریافت payment
✅ ایجاد Portfolio
✅ آپلود Resume
```

### فیلدهای پروفایل:
```typescript
{
  role: 'freelancer',
  full_name: string,
  email: string,
  title: string, // e.g. "Senior Solidity Developer"
  bio: string,
  skills: string[], // ["Solidity", "React", "Web3"]
  hourly_rate: number,
  location: string,
  avatar: string,
  resume_url: string,
  portfolio: Array<{
    title: string,
    description: string,
    images: string[],
    link: string
  }>,
  total_projects: number,
  completed_projects: number,
  rating: number,
  success_rate: number
}
```

### Dashboard:
```
📊 Dashboard های فریلنسر:
├── Find Work (Browse Jobs)
├── My Applications
├── Active Projects
├── Messages
├── Earnings & Wallet
├── Portfolio
└── Profile Settings
```

### نمونه Workflow:
```
1. تکمیل پروفایل
   └─> Skills، Resume، Portfolio

2. جستجوی پروژه
   └─> فیلتر بر اساس skill، budget

3. Apply کردن
   └─> ارسال Proposal:
       • Cover Letter
       • قیمت پیشنهادی
       • مدت زمان پیشنهادی
   └─> وضعیت: Pending
   └─> 🚫 چت هنوز باز نیست

4. منتظر Accept
   └─> Client proposals را بررسی می‌کند

5. پس از Accept
   └─> 💬 Chat باز می‌شود
   └─> ارتباط مستقیم با client

6. انجام کار
   └─> ارسال فایل‌ها از طریق چت
   └─> بروزرسانی‌های منظم

7. Mark as Complete
   └─> درخواست Release Payment

8. دریافت پرداخت
   └─> + NFT Certificate
   └─> Rating & Review
```

---

## 🔄 مقایسه نقش‌ها

| قابلیت | Client | Freelancer |
|--------|--------|------------|
| **ایجاد پروژه** | ✅ | ❌ |
| **Apply به پروژه** | ❌ | ✅ |
| **واریز Escrow** | ✅ | ❌ |
| **دریافت Payment** | ❌ | ✅ |
| **Resume** | ❌ | ✅ |
| **Portfolio** | ❌ | ✅ |
| **Company Name** | ✅ | ❌ |
| **Verification Badge** | ✅ (اختیاری) | ❌ |
| **چت** | ✅ (بعد از accept) | ✅ (بعد از accept) |
| **Rating دادن** | ✅ | ✅ |
| **رای DAO** | ✅ | ✅ |

---

## 📝 ثبت‌نام (Register Flow)

### Step 1: انتخاب نقش
```
┌─────────────────────────────────┐
│   I want to...                  │
├─────────────────────────────────┤
│                                 │
│  [💼 Hire Talent]               │
│  I'm looking to hire            │
│  freelancers for my projects    │
│                                 │
│  [🎯 Find Work]                 │
│  I'm a freelancer looking       │
│  for projects                   │
│                                 │
└─────────────────────────────────┘
```

### Step 2: فرم ثبت‌نام
```
Signing up as: Client / Freelancer

┌─────────────────────────────────┐
│ Full Name: [.................]  │
│ Email: [.....................]  │
│ Password: [.................]   │
│ Confirm Password: [...........]  │
│                                 │
│ [✓] I agree to Terms & Privacy  │
│                                 │
│ [Create Account] or [← Back]    │
└─────────────────────────────────┘
```

### Step 3: ری‌دایرکت
```
Client → Dashboard (Create Project)
Freelancer → Profile Setup (Add Skills, Resume)
```

---

## 🎨 تفاوت‌های UI

### Client Dashboard:
```
Navbar:
- Dashboard
- Post a Project  ← مخصوص client
- Find Freelancers
- My Projects
- Messages
- Payments
```

### Freelancer Dashboard:
```
Navbar:
- Dashboard
- Find Work  ← مخصوص freelancer
- My Applications
- Active Jobs
- Messages
- Earnings
- Portfolio  ← مخصوص freelancer
```

---

## 🔐 دسترسی‌ها (Authorization)

### Routes مخصوص Client:
```
✅ /projects/create
✅ /projects/:id/applications
✅ /projects/:id/accept
✅ /freelancers (browse)
❌ /jobs/apply
❌ /portfolio
```

### Routes مخصوص Freelancer:
```
✅ /find-work
✅ /jobs/:id/apply
✅ /portfolio
✅ /profile/resume
❌ /projects/create
❌ /freelancers (browse)
```

### Routes مشترک:
```
✅ /dashboard
✅ /messages
✅ /wallets
✅ /settings
✅ /disputes (رای‌گیری DAO)
```

---

## 💾 Database Schema

### users table:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL, -- hashed
  role VARCHAR NOT NULL CHECK (role IN ('client', 'freelancer')),
  address VARCHAR UNIQUE, -- wallet (optional)
  username VARCHAR UNIQUE,
  full_name VARCHAR,
  bio TEXT,
  avatar VARCHAR,
  
  -- For freelancers:
  title VARCHAR,
  skills JSONB DEFAULT '[]',
  hourly_rate DECIMAL,
  resume_url VARCHAR,
  portfolio JSONB DEFAULT '[]',
  
  -- For clients:
  company_name VARCHAR,
  website VARCHAR,
  verified BOOLEAN DEFAULT false,
  
  -- Common:
  location VARCHAR,
  total_projects INT DEFAULT 0,
  completed_projects INT DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 🚀 Backend API

### Auth:
```go
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "********",
  "full_name": "John Doe",
  "role": "freelancer", // or "client"
  "username": "johndoe"
}
```

### Profile Update (role-based):
```go
PUT /api/v1/users/me
// Freelancer:
{
  "title": "Senior Solidity Developer",
  "skills": ["Solidity", "Web3", "React"],
  "hourly_rate": 100,
  "resume_url": "ipfs://..."
}

// Client:
{
  "company_name": "Acme Corp",
  "website": "https://acme.com",
  "bio": "We build DeFi products"
}
```

---

## ✅ Checklist پیاده‌سازی

### Frontend:
- [x] صفحه Register با انتخاب Role
- [x] Profile Freelancer
- [x] Profile Client
- [ ] Dashboard Client (مخصوص)
- [ ] Dashboard Freelancer (مخصوص)
- [ ] Route Protection بر اساس Role
- [ ] Conditional Rendering در Navbar

### Backend:
- [x] User Model با Role
- [ ] Auth Handlers (Email/Password)
- [ ] Role-based Middleware
- [ ] Profile endpoints (role-aware)
- [ ] Authorization checks

---

**ساخته شده برای FARIIMA Platform 🚀**
