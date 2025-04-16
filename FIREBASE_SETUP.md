
# راه‌اندازی فایربیس برای گنسپارک

## مقدمه
این راهنما به شما کمک می‌کند تا پروژه Firebase را برای اپلیکیشن "گنسپارک" راه‌اندازی کنید.

## مراحل راه‌اندازی

### ۱. ایجاد پروژه Firebase
1. به [کنسول Firebase](https://console.firebase.google.com) بروید
2. روی "Add project" کلیک کنید
3. نام پروژه (مثلاً "Genspark") را وارد کنید
4. مراحل ساخت پروژه را تکمیل کنید

### ۲. تنظیم Firestore Database
1. در منوی سمت چپ، به بخش "Build > Firestore Database" بروید
2. روی "Create database" کلیک کنید
3. حالت "Start in production mode" را انتخاب کنید
4. منطقه جغرافیایی نزدیک به خود را انتخاب کنید
5. منتظر بمانید تا دیتابیس ایجاد شود

### ۳. تنظیم قوانین امنیتی Firestore
1. به بخش "Rules" در Firestore بروید
2. قوانین زیر را وارد کنید:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // برای مرحله اول - در محیط تولید باید محدود شود
    }
  }
}
```
3. روی "Publish" کلیک کنید

### ۴. راه‌اندازی Firebase Web App
1. در صفحه اصلی پروژه روی آیکون وب (</>) کلیک کنید
2. نام اپلیکیشن (مثلاً "Genspark Web") را وارد کنید
3. گزینه "Also set up Firebase Hosting" را انتخاب کنید
4. روی "Register app" کلیک کنید
5. تنظیمات Firebase که نمایش داده می‌شود را کپی کنید

### ۵. تنظیم تنظیمات Firebase در پروژه
1. فایل `src/lib/firebase.ts` را باز کنید
2. اطلاعات `firebaseConfig` را با اطلاعات کپی شده از مرحله قبل جایگزین کنید:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### ۶. نصب Firebase CLI و دیپلوی پروژه
1. Firebase CLI را نصب کنید:
```bash
npm install -g firebase-tools
```

2. با Firebase لاگین کنید:
```bash
firebase login
```

3. پروژه را initialize کنید:
```bash
firebase init
```
- Firestore و Hosting را انتخاب کنید
- پروژه Firebase که ایجاد کردید را انتخاب کنید
- برای مسیر فایل‌های عمومی: `dist` را وارد کنید
- برای تنظیم اپلیکیشن تک صفحه‌ای: `yes` را انتخاب کنید

4. پروژه را build کنید:
```bash
npm run build
```

5. پروژه را دیپلوی کنید:
```bash
firebase deploy
```

## ساختار دیتابیس
پس از راه‌اندازی، کالکشن‌های زیر به صورت خودکار در Firestore ایجاد خواهند شد:
- `goals`: برای نگهداری اهداف
- `ideas`: برای نگهداری ایده‌ها
- `projects`: برای نگهداری پروژه‌ها
- `tasks`: برای نگهداری کارها
- `tags`: برای نگهداری تگ‌ها
