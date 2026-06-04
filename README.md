# ApniSite — Smart Daily Site Reporting Platform

ApniSite is a premium, responsive Daily Site Reporting Platform built for construction supervisors and builders/admins. It acts as a digital daily site diary/logbook to capture key activities, worker headcount, materials used, and progress photos directly from the field, allowing admin builders to track progress in real-time.

---

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Programming Language**: TypeScript
- **Database & ORM**: SQLite + Prisma ORM
- **Authentication**: Auth.js (NextAuth.js v5 Beta)
- **Form Management**: React Hook Form + Zod (Validation Schema)
- **Icons**: Lucide Icons

---

## 🔑 Key Features

### 🤵 Authentication & Role-Based Routing
- Secure authentication with session persistence using Auth.js.
- Role-based routing for **Builder (Admin)** and **Site Supervisor** roles.
- Direct redirection based on user credentials.

### 📊 Builder / Admin Dashboard
- **Total Reports Card**: Lifetime total of submitted daily report logs.
- **Today's Workers Card**: Dynamic count of workers present on sites today.
- **Reports Submitted Today Card**: Check if supervisors have filed today's log.
- **Active Supervisors Card**: Total count of registered supervisors in the system.
- **Recent Reports Table**: Paginated list of recent submissions with quick views.

### 📝 Supervisor Submission Form
- **Dynamic Worker Input**: Capture worker headcount.
- **Detailed Tasks Logs**: Text area fields to record tasks completed.
- **Materials Logger**: Record material consumptions and deliveries.
- **Photo Upload Slots**: Upload 1 mandatory **Attendance Photo** and up to 2 optional **Progress Photos** (fully previewed on select).

### 🔍 Search, Filter, and Pagination
- Advanced Search by supervisor name or logs keywords.
- Paginated table listings for cleaner layout and scaling.

### 🖼️ Zoomable Image Gallery (Lightbox)
- Custom-built `ImageGallery` grid showing site and attendance images.
- Fully accessible modal lightbox for zooming and reviewing uploaded photos.

### 🖨️ PDF Export & Reports Archive
- Custom CSS print media overrides that strip out header, navigation, and sidebar controls.
- Instantly export formatted, printer-friendly reports to PDF directly from the report details view.

---

## 🧑‍💻 Demo Accounts & Credentials

For test testing and validation, use the pre-configured accounts below:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Builder / Admin** | `admin@apnisite.com` | `password123` |
| **Site Supervisor** | `supervisor@apnisite.com` | `password123` |
| **Site Supervisor 2** | `sup2@apnisite.com` | `password123` |

---

## 🚀 Setup Instructions

Follow these steps to run ApniSite locally:

### 1. Clone the repository and install dependencies
```bash
git clone https://github.com/sreeram0343/apni-site.git
cd apni-site
npm install
```

### 2. Configure Environment Variables
Copy the template `.env.example` file and create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Ensure your `.env` contains an `AUTH_SECRET` (generate one using `npx auth secret` or enter a custom key):
```env
AUTH_SECRET="apni_site_local_secret_key_123456_secure_random_hash"
```

### 3. Initialize & Seed SQLite Database
Run the Prisma commands to build the local SQLite database schema and pre-populate historical reports and supervisor accounts:
```bash
# Push database schema
npx prisma db push

# Seed historical data (14 days of reports)
npx prisma db seed
```

### 4. Run Development Server
Start the Next.js local development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Production Build and Code Quality Check

Compile the optimized bundle and check for lint or type errors:
```bash
# Verify TypeScript types
npx tsc --noEmit

# Verify ESLint quality guidelines
npm run lint

# Build optimized production bundle
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
