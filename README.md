# StudioBinder × Creative Developer — Persian Handbook

یک سایت ایستا و راست‌به‌چپ که اصول فیلم‌سازی را به زبان ساده برای توسعه‌دهنده‌های خلاق توضیح می‌دهد. موضوع مجموعه‌ها از کانال StudioBinder الهام گرفته شده، ولی متن درس‌ها مستقل نوشته شده است.

- **۲۲ مجموعه** و **۱۴۲ درس**. عنوان درس‌ها لزوماً همان عنوان قسمت‌های یوتیوب نیست.
- هر درس پنج بخش دارد: مفهوم در سینما (با مثال از فیلم‌های واقعی)، کاربرد در وب، نمونه کد با توضیح، تمرین و اشتباه رایج.
- جستجو و فیلتر موضوعی در خود مرورگر انجام می‌شود. درس‌های ذخیره‌شده در LocalStorage می‌مانند.
- برای درس‌های دوربین یک دموی CSS داخل صفحه هست، و یک آزمایشگاه جدا با Three.js و GSAP.
- فونتی که صاحب پروژه آپلود کرده، داخل CSS جاسازی شده است. پیش از انتشار عمومی، مجوز بازنشر فونت را بررسی کنید.

## ساختار محتوا

هر مجموعه یک فایل جدا در پوشه `content/` دارد (مثلاً `content/01-the-shot-list.js`). ترتیب تگ‌های script در `index.html` همان ترتیب نمایش مجموعه‌ها در سایت است.

هر درس این فیلدها را دارد:

| فیلد | توضیح |
| --- | --- |
| `title` / `fa` | عنوان انگلیسی و فارسی |
| `summary` | یک جمله که ایده اصلی درس را می‌گوید |
| `concept` | چند پاراگراف درباره مفهوم در سینما |
| `web` | چند پاراگراف درباره کاربردش در وب |
| `code` / `codeNote` | نمونه کد و توضیح اینکه چه کار می‌کند |
| `stack` | ابزار اصلی (CSS، GSAP، Three.js و غیره) |
| `exercise` / `mistake` | تمرین و اشتباه رایج |

برای ویرایش یک درس فقط فایل مجموعه‌اش را باز کن. شناسه درس‌ها (`slug-شماره`) از ترتیبشان ساخته می‌شود، پس اگر درسی را وسط یک مجموعه اضافه یا حذف کنی، درس‌هایی که کاربرها قبلاً ذخیره کرده‌اند جابه‌جا می‌شوند. درس جدید را بهتر است آخر مجموعه اضافه کنی.

## GitHub Pages

انتشار به‌صورت خودکار با GitHub Actions انجام می‌شود (`.github/workflows/deploy.yml`).

- هر `push` روی شاخه `main` سایت را دوباره منتشر می‌کند. اجرای دستی هم از **Actions → Deploy to GitHub Pages → Run workflow** ممکن است.
- تنظیم ریپو: **Settings → Pages → Source = GitHub Actions**.
- آدرس سایت: https://devamir99.github.io/studiobinder-shortlist-all-playlist/

## منابع و راستی‌آزمایی

- https://www.youtube.com/@StudioBinder/playlists
- https://www.studiobinder.com/filmmaking-techniques/
- https://www.classcentral.com/course/youtube-the-shot-list-80162
- https://www.studiobinder.com/blog/cinematography-techniques-no-film-school/
- https://www.studiobinder.com/tutorials/visualize/directors-guide-to-shot-list/
- https://www.studiobinder.com/tutorials/visualize/intro-to-shot-list/

**پوشش:** بدون دسترسی مستقیم به فهرست کامل YouTube Data API، نمی‌شود تأیید کرد که این فهرست همه پلی‌لیست‌ها یا قسمت‌های کانال را پوشش می‌دهد. مجموعه‌هایی که وضعیتشان `unverified` است، موضوع‌هایی‌اند که از کانال برداشته شده‌اند ولی هنوز با پلی‌لیست‌های فعلی تطبیق داده نشده‌اند و نباید به‌عنوان پلی‌لیست رسمی معرفی شوند.
