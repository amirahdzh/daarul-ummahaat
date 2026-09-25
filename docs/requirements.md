# WEBSITE REQUIREMENT DOCUMENT

## Yayasan Daarul Ummahaat

**Versi:** 2.0
**Status:** Draft / Stack-Agnostic
**Tujuan Dokumen:** Menjadi functional requirement dan acuan brainstorming teknologi bersama AI agent.

---

# 1. Gambaran Proyek

## 1.1 Tujuan Website

Website Yayasan Daarul Ummahaat bertujuan untuk:

* Memperkenalkan yayasan kepada masyarakat luas.
* Menampilkan profil, visi, misi, dan aktivitas yayasan.
* Menampilkan program-program yang dijalankan yayasan.
* Menampilkan kegiatan dan agenda acara yayasan.
* Menampilkan dokumentasi kegiatan.
* Meningkatkan kredibilitas dan kepercayaan calon donatur.
* Menyediakan informasi donasi yang mudah diakses.
* Menyediakan informasi kontak yayasan.
* Menjadi sumber informasi resmi mengenai kegiatan dan program yayasan.

## 1.2 Jenis Website

**Non-Profit Foundation / Organization Website**

Karakteristik:

* Public-facing website.
* Content-driven.
* Dynamic content management.
* Responsive.
* SEO-friendly.
* Admin-friendly.
* Mudah dikembangkan di masa depan.

---

# 2. Prinsip Teknologi

## 2.1 Stack-Agnostic Requirement

Dokumen ini **tidak mengunci teknologi implementasi tertentu**.

Developer / AI agent dapat mengusulkan teknologi yang sesuai dengan kebutuhan proyek.

Contoh area yang dapat dieksplorasi:

* CMS
* Headless CMS
* Traditional CMS
* Custom Admin Panel
* Static Site Generator
* Full-stack Web Framework
* Database
* Backend Framework
* Frontend Framework
* Hosting Platform
* CDN
* Image Storage
* Search
* Form Handling
* Authentication
* Caching
* SEO tooling
* Analytics
* Backup solution

Tidak ada kewajiban menggunakan:

* WordPress
* ACF
* Custom Post Type UI
* Plugin tertentu
* Framework frontend tertentu
* Framework backend tertentu
* Database tertentu

Pemilihan stack harus didasarkan pada:

* Kesesuaian dengan requirement.
* Kemudahan pengelolaan konten.
* Performance.
* Security.
* SEO.
* Maintainability.
* Biaya hosting dan operasional.
* Kemudahan deployment.
* Kemudahan pengembangan oleh developer atau AI agent.
* Kemudahan scaling apabila kebutuhan website berkembang.

---

# 3. Technology Decision Requirements

Sebelum implementasi, developer / AI agent dapat membandingkan beberapa alternatif stack.

Contoh:

### Option A — CMS-Based

Website menggunakan CMS yang sudah tersedia.

### Option B — Headless CMS

Frontend dan content management dipisahkan.

### Option C — Full Custom

Frontend, backend, database, dan admin panel dibangun secara custom.

### Option D — Hybrid

Menggunakan kombinasi CMS / managed services / custom frontend.

Pemilihan teknologi tidak ditentukan oleh dokumen ini.

Developer / AI agent diharapkan dapat menjelaskan:

* Architecture.
* Technology stack.
* Alasan pemilihan.
* Kelebihan.
* Kekurangan.
* Estimasi complexity.
* Maintenance requirement.
* Hosting requirement.
* Security consideration.
* SEO consideration.
* Migration consideration.
* Lock-in risk.

---

# 4. Struktur Menu Utama

Menu utama:

1. Home
2. About
3. Programs
4. Events
5. Gallery
6. Donate
7. Contact

Struktur menu harus dapat dikembangkan apabila website membutuhkan halaman tambahan di masa depan.

---

# 5. Sitemap

```text
Home

About
├── Foundation Profile
├── Vision & Mission
├── Organization Structure
└── Legal Documents

Programs
├── Program Archive
└── Program Detail

Events
├── Event Archive
└── Event Detail

Gallery

Donate

Contact
```

---

# 6. Content Architecture

Website membutuhkan sistem content management yang memungkinkan administrator mengelola konten tanpa mengubah source code.

Content architecture minimal terdiri dari:

* Programs
* Events
* Gallery
* Impact Statistics
* About / Foundation Profile
* Organization Structure
* Legal Documents
* Donation Information
* Contact Information
* Site Settings

Implementasi content architecture dapat menggunakan:

* CMS content types
* Database models
* Collections
* Custom entities
* Structured content
* atau pendekatan lain yang sesuai dengan stack terpilih.

---

# 7. Content Model — Programs

## 7.1 Entity

**Program**

## 7.2 URL

Archive:

```text
/programs
```

Detail:

```text
/programs/{program-slug}
```

## 7.3 Program Categories

* Pendidikan
* Pembinaan Yatim
* Kesejahteraan Masyarakat

Kategori harus dapat dikelola melalui sistem administrasi.

## 7.4 Daftar Program Awal

### Pendidikan

* Beasiswa Kuliah
* Tahsin Tahfizh Gratis Yatim Dhuafa
* Bimbel Gratis
* Sanlat Yatim dan Santri Tahfizh
* Wisuda 30 Juz

### Pembinaan Yatim

* Santunan Yatim
* Bukber Bareng Yatim
* Rihlah Yatim

### Kesejahteraan Masyarakat

* Santunan Dhuafa
* Pengajian Ibu-Ibu
* Sahur I'tikaf

## 7.5 Program Fields

| Field                | Requirement           |
| -------------------- | --------------------- |
| Program Name         | Required              |
| Slug                 | Required, unique      |
| Short Description    | Required              |
| Featured Image       | Optional/Recommended  |
| Program Category     | Required              |
| Target Beneficiaries | Optional              |
| Program Objectives   | Optional rich content |
| Program Activities   | Optional rich content |
| Location             | Optional              |
| Program Schedule     | Optional              |
| Gallery              | Optional              |
| Donation CTA         | Optional              |
| Registration CTA     | Optional              |
| Status               | Required              |

## 7.6 Program Status

* Active
* Seasonal
* Completed

---

# 8. Content Model — Events

## 8.1 Entity

**Event**

## 8.2 URL

Archive:

```text
/events
```

Detail:

```text
/events/{event-slug}
```

## 8.3 Event Categories

* Kajian
* Pelatihan
* Santunan
* Ramadhan
* Wisuda
* Kegiatan Yatim

Kategori harus dapat dikelola melalui sistem administrasi.

## 8.4 Event Fields

| Field             | Requirement           |
| ----------------- | --------------------- |
| Event Name        | Required              |
| Slug              | Required, unique      |
| Featured Image    | Optional              |
| Event Date        | Required              |
| Event Time        | Optional              |
| Location          | Optional              |
| Google Maps URL   | Optional              |
| Description       | Optional rich content |
| Registration Link | Optional              |
| Photo Gallery     | Optional              |
| Video Link        | Optional              |
| Event Category    | Optional              |

---

# 9. Content Model — Gallery

## 9.1 Entity

**Gallery / Media Collection**

Gallery harus mendukung:

* Upload multiple images.
* Image title/caption.
* Category.
* Association dengan Program.
* Association dengan Event.
* Featured image.
* Sorting/order.

## 9.2 Gallery Categories

* Programs
* Events
* Ramadhan
* Wisuda
* Yatim
* General

Kategori dapat dikelola oleh admin.

---

# 10. Content Model — Impact Statistics

Website harus memiliki sistem untuk mengelola statistik dampak.

Contoh:

* 100+ Yatim Dibina
* 50+ Mahasiswa Mendapat Beasiswa
* 30+ Huffazh Lulus Wisuda
* 1000+ Penerima Manfaat

## Fields

| Field           | Requirement |
| --------------- | ----------- |
| Label           | Required    |
| Value           | Required    |
| Description     | Optional    |
| Icon            | Optional    |
| Display Order   | Optional    |
| Active/Inactive | Required    |

Data harus dapat diubah melalui admin tanpa mengubah source code.

---

# 11. Content Model — Foundation Profile

Admin harus dapat mengelola:

* Nama yayasan.
* Profil yayasan.
* Sejarah yayasan.
* Visi.
* Misi.
* Core values.
* Struktur organisasi.
* Foto organisasi.
* Dokumen legalitas.

---

# 12. Content Model — Legal Documents

Sistem harus mendukung upload dan pengelolaan dokumen.

Format minimal:

* PDF
* JPG
* PNG

Setiap dokumen dapat memiliki:

* Nama dokumen.
* File.
* Deskripsi.
* Tahun.
* Status publish.

---

# 13. Halaman Home

## Section 1 — Hero

Menampilkan:

* Nama Yayasan.
* Tagline.
* Featured image / visual.

CTA:

* Donate Now
* View Programs

---

## Section 2 — About Foundation

Menampilkan ringkasan:

* Siapa kami.
* Misi yayasan.
* Dampak yang telah dicapai.

Button:

* Learn More

---

## Section 3 — Featured Programs

Menampilkan:

* 6 program unggulan.

Data berasal dari content management system.

Admin harus dapat menentukan program yang ditampilkan atau sistem dapat menggunakan mekanisme featured content.

---

## Section 4 — Impact Statistics

Menampilkan statistik dampak yang dikelola melalui admin.

---

## Section 5 — Latest Events

Menampilkan:

* 3 event terbaru.

Data berasal dari event content system.

---

## Section 6 — Gallery Preview

Menampilkan foto-foto terbaru.

Button:

* View Gallery

---

## Section 7 — Donation CTA

Teks:

> Dukung misi kami dalam membina, mendidik, dan memberdayakan masyarakat.

Button:

* Donate

---

# 14. Halaman About

## Foundation Profile

* Profil yayasan.
* Sejarah berdirinya yayasan.

## Vision & Mission

* Visi.
* Misi.

## Core Values

* Nilai-nilai yayasan.

## Organization Structure

* Struktur organisasi.
* Foto atau diagram organisasi.

## Legal Documents

Menampilkan dokumen legalitas yang tersedia.

---

# 15. Halaman Programs Archive

## Features

* Menampilkan seluruh program.
* Filter berdasarkan kategori.
* Search opsional.
* Pagination atau load more.
* Responsive layout.

## Filter

* All
* Pendidikan
* Pembinaan Yatim
* Kesejahteraan Masyarakat

## Layout

Card Grid.

## Card Content

* Featured Image.
* Program Title.
* Category.
* Short Description.
* Read More.

---

# 16. Halaman Single Program

Struktur:

1. Hero Image
2. Program Overview
3. Program Objectives
4. Target Beneficiaries
5. Program Activities
6. Schedule
7. Gallery
8. Call To Action

CTA:

* Donate
* Contact Us

---

# 17. Halaman Events Archive

## Features

* Menampilkan event.
* Filter berdasarkan kategori.
* Sorting berdasarkan tanggal.
* Pagination atau load more.

## Layout

Card Grid.

## Card Content

* Featured Image.
* Event Title.
* Event Date.
* Location.
* Short Description.

---

# 18. Halaman Single Event

Struktur:

1. Featured Image
2. Event Information
3. Event Description
4. Gallery
5. Registration Button
6. Google Maps Location

---

# 19. Halaman Gallery

## Features

* Gallery grid.
* Category filter.
* Responsive layout.
* Lightbox.
* Image caption.
* Lazy loading.
* Optimized images.

Layout dapat menggunakan:

* Grid
* Masonry
* atau layout lain yang sesuai dengan design.

---

# 20. Halaman Donate

## Section 1 — Introduction

Menjelaskan:

* Tujuan donasi.
* Dampak donasi.
* Program yang dapat didukung.

---

## Section 2 — Donation Methods

Metode yang dapat ditampilkan:

* Bank Transfer
* QRIS
* E-Wallet

Semua informasi harus dapat dikelola melalui admin.

---

## Section 3 — Bank Information

Minimal fields:

| Field                  | Requirement |
| ---------------------- | ----------- |
| Bank Name              | Required    |
| Account Number         | Required    |
| Account Holder         | Required    |
| QR Image               | Optional    |
| Additional Information | Optional    |

---

## Section 4 — Donation Confirmation

Button:

* Konfirmasi Donasi via WhatsApp

Nomor / link WhatsApp dapat diubah melalui admin.

---

# 21. Halaman Contact

## Contact Information

* Alamat.
* Nomor Telepon.
* WhatsApp.
* Email.
* Google Maps.

## Contact Form

Minimum fields:

* Nama.
* Email.
* Nomor WhatsApp.
* Pesan.

Requirements:

* Validation.
* Spam protection.
* Success state.
* Error state.
* Email notification.
* Secure form handling.

---

# 22. Admin / Content Management Requirements

Administrator harus dapat mengelola konten utama website tanpa mengubah source code.

## Programs

* Create.
* Read.
* Update.
* Delete.
* Publish / unpublish.
* Manage categories.
* Upload images.

## Events

* Create.
* Read.
* Update.
* Delete.
* Publish / unpublish.
* Manage categories.
* Upload images.

## Gallery

* Upload multiple images.
* Delete images.
* Edit metadata.
* Manage categories.
* Associate images dengan program/event.

## Impact Statistics

* Add.
* Edit.
* Delete.
* Reorder.
* Activate/deactivate.

## About

* Edit foundation profile.
* Edit history.
* Edit vision.
* Edit mission.
* Edit core values.
* Manage organization structure.
* Upload legal documents.

## Donation

* Edit bank information.
* Edit QRIS.
* Edit e-wallet information.
* Edit WhatsApp confirmation link.

## Contact

* Edit address.
* Edit phone number.
* Edit WhatsApp.
* Edit email.
* Edit Google Maps location.

---

# 23. Admin UX Requirements

Admin interface harus:

* Mudah digunakan oleh non-technical user.
* Tidak membutuhkan coding untuk content management.
* Memiliki form validation.
* Memiliki media upload management.
* Memiliki draft/publish workflow apabila didukung stack.
* Memiliki preview content apabila memungkinkan.
* Memiliki role/permission system apabila dibutuhkan.

---

# 24. SEO Requirements

Website harus mendukung:

* SEO-friendly URL.
* Editable page title.
* Editable meta description.
* Open Graph metadata.
* XML sitemap.
* Canonical URL.
* Structured data / schema markup.
* Semantic HTML.
* Image alt text.
* Indexing control.
* Robots configuration.

SEO implementation dapat menggunakan native functionality atau third-party tooling sesuai stack.

---

# 25. Performance Requirements

Website harus:

* Responsive.
* Mobile-first.
* Fast loading.
* Menggunakan optimized images.
* Menggunakan lazy loading jika relevan.
* Menggunakan caching apabila relevan.
* Mengurangi unnecessary JavaScript.
* Mengurangi unnecessary third-party scripts.

Target awal:

**Google PageSpeed / Lighthouse Performance: >80**

Target ini merupakan target awal, bukan jaminan absolut karena hasil dapat dipengaruhi oleh hosting, network, third-party services, dan kondisi testing.

---

# 26. Security Requirements

Website harus memperhatikan:

* HTTPS / SSL.
* Secure authentication.
* Secure admin access.
* Input validation.
* Output escaping.
* Protection terhadap spam.
* Protection terhadap common web vulnerabilities.
* Secure file upload.
* Access control.
* Dependency/package updates.
* Secure secrets management.

---

# 27. Backup & Recovery

Website harus memiliki:

* Automatic backup.
* Database backup.
* Media/file backup.
* Backup retention policy.
* Recovery procedure.

Frekuensi backup dapat ditentukan berdasarkan stack dan hosting yang dipilih.

Target minimum:

**Daily backup**

---

# 28. Integrations

Website harus dapat terintegrasi dengan:

* WhatsApp.
* Google Maps.
* Email delivery service.
* Analytics platform, apabila diperlukan.
* Search engine tools, apabila diperlukan.

Integrasi tambahan dapat ditambahkan di masa depan.

---

# 29. Responsive Design

Website harus bekerja dengan baik pada:

* Desktop.
* Laptop.
* Tablet.
* Mobile.

Minimum consideration:

* Navigation.
* Typography.
* Images.
* Cards.
* Forms.
* Gallery.
* Buttons.
* Tables.
* Admin/editor interface jika relevan.

---

# 30. Accessibility

Website sebaiknya mengikuti prinsip accessibility modern.

Minimum:

* Semantic HTML.
* Keyboard navigation.
* Sufficient color contrast.
* Alt text.
* Form labels.
* Accessible buttons.
* Focus states.
* Meaningful headings.

---

# 31. Browser Compatibility

Website harus diuji pada browser modern.

Minimum target:

* Chrome.
* Safari.
* Firefox.
* Edge.

Testing harus mencakup desktop dan mobile viewport.

---

# 32. Content Management Architecture

Implementasi dapat menggunakan salah satu pendekatan:

### Approach A — Traditional CMS

Frontend dan content management berada dalam satu platform.

### Approach B — Headless CMS

Content management dan frontend dipisahkan melalui API.

### Approach C — Custom Admin

Admin panel dibangun khusus untuk kebutuhan website.

### Approach D — Hybrid

Menggabungkan CMS, managed services, dan custom application.

Tidak ada pendekatan yang ditentukan sebelumnya.

Pemilihan harus mempertimbangkan:

* Cost.
* Complexity.
* Developer experience.
* AI-agent compatibility.
* Content editor experience.
* Performance.
* Security.
* SEO.
* Maintainability.
* Deployment.
* Vendor lock-in.

---

# 33. AI Agent Compatibility

Karena pengembangan website akan melibatkan AI agent, stack yang dipilih sebaiknya:

* Memiliki dokumentasi yang baik.
* Memiliki struktur project yang jelas.
* Mudah diinspeksi oleh AI agent.
* Mudah dimodifikasi melalui code.
* Memiliki tooling yang stabil.
* Memiliki predictable development workflow.
* Memiliki testability yang baik.
* Memiliki linting / formatting yang jelas.
* Memiliki deployment workflow yang terdokumentasi.
* Tidak bergantung secara berlebihan pada konfigurasi manual yang sulit direproduksi.

AI agent harus dapat membantu dalam:

* Membuat fitur.
* Memodifikasi UI.
* Memodifikasi content model.
* Membuat API/integrasi.
* Debugging.
* Testing.
* Refactoring.
* SEO implementation.
* Performance optimization.
* Documentation.

---

# 34. Environment Requirements

Development sebaiknya memiliki environment terpisah:

```text
Development
     ↓
Staging
     ↓
Production
```

Minimal:

* Development environment.
* Production environment.

Staging environment direkomendasikan apabila workflow memungkinkan.

Configuration dan secrets tidak boleh hard-coded ke source code.

---

# 35. Version Control

Source code, apabila menggunakan custom development, harus menggunakan version control.

Minimum:

* Git.
* Repository.
* Branching strategy yang sederhana.
* Commit history.
* Environment configuration.
* Deployment documentation.

---

# 36. Testing Requirements

Sebelum deployment production harus dilakukan testing minimal terhadap:

### Functional

* Navigation.
* Programs.
* Events.
* Gallery.
* Donation.
* Contact.
* Forms.
* Admin content management.

### Responsive

* Desktop.
* Tablet.
* Mobile.

### Browser

* Chrome.
* Safari.
* Firefox.
* Edge.

### Performance

* Lighthouse / PageSpeed.
* Image optimization.
* Loading behavior.

### Security

* Authentication.
* Authorization.
* Forms.
* File uploads.
* Sensitive configuration.

---

# 37. Deployment

Website harus dapat di-deploy ke production environment.

Dokumentasi deployment minimal mencakup:

* Hosting requirements.
* Environment variables.
* Database setup jika diperlukan.
* Domain configuration.
* SSL.
* Build process jika diperlukan.
* Deployment process.
* Backup process.
* Rollback/recovery process.

---

# 38. Deliverables

Developer / AI agent wajib menghasilkan:

* Website yang berfungsi penuh.
* Responsive design.
* Semua halaman yang tercantum dalam requirement.
* Program management.
* Event management.
* Gallery management.
* Impact statistics management.
* Donation information management.
* Contact information management.
* Admin/content management interface.
* SEO dasar.
* Performance optimization.
* Security configuration.
* Backup configuration.
* Deployment ke production.
* Dokumentasi penggunaan.
* Dokumentasi teknis.
* Testing dan bug fixing sebelum serah terima.

Technology stack yang digunakan harus didokumentasikan secara jelas.

---

# 39. Acceptance Criteria

Website dianggap memenuhi requirement apabila:

1. Semua halaman utama dapat diakses.
2. Programs dapat dikelola oleh admin.
3. Events dapat dikelola oleh admin.
4. Gallery dapat dikelola oleh admin.
5. Impact statistics dapat diedit oleh admin.
6. Informasi donation dapat diedit oleh admin.
7. Informasi contact dapat diedit oleh admin.
8. Konten dapat diperbarui tanpa perubahan source code.
9. Website responsive pada desktop, tablet, dan mobile.
10. Form contact berfungsi.
11. WhatsApp integration berfungsi.
12. Google Maps integration berfungsi.
13. SEO dasar telah dikonfigurasi.
14. HTTPS aktif pada production.
15. Backup telah dikonfigurasi.
16. Tidak terdapat critical bug sebelum handover.
17. Deployment dan maintenance process terdokumentasi.

---

# 40. Out of Scope untuk Versi Awal

Fitur berikut tidak wajib untuk MVP:

* Online payment gateway.
* User/member account.
* Donor dashboard.
* Donation transaction management.
* Recurring donation.
* Online registration system kompleks.
* E-commerce.
* Mobile application.
* Multi-language.
* Advanced analytics dashboard.

Fitur tersebut dapat dipertimbangkan pada fase berikutnya.

---

# 41. Future Expansion

Arsitektur sebaiknya memungkinkan pengembangan fitur seperti:

* Online donation/payment.
* Donor database.
* Donation history.
* Recurring donation.
* Volunteer management.
* Online registration.
* Newsletter.
* Blog/news.
* Multi-language.
* Search.
* Advanced filtering.
* Analytics dashboard.
* Member portal.
* Mobile application.
* API untuk integrasi pihak ketiga.

Fitur future expansion tidak harus diimplementasikan pada versi awal, tetapi keputusan architecture sebaiknya tidak membuat pengembangan tersebut unnecessarily sulit.

---

# 42. Technology Selection — To Be Decided

Bagian ini sengaja **tidak ditentukan** dalam requirement awal.

Developer / AI agent dapat membuat proposal teknologi berdasarkan requirement di atas.

Proposal dapat membandingkan beberapa alternatif berdasarkan:

| Criteria               | Weight / Consideration |
| ---------------------- | ---------------------- |
| Development Speed      | High                   |
| Admin Experience       | High                   |
| Performance            | High                   |
| SEO                    | High                   |
| Security               | High                   |
| Maintainability        | High                   |
| AI Agent Compatibility | High                   |
| Hosting Cost           | Medium                 |
| Development Cost       | Medium                 |
| Scalability            | Medium                 |
| Vendor Lock-in         | Medium                 |
| Ease of Deployment     | High                   |

Hasil akhir pemilihan stack harus berupa **technical decision**, bukan bagian dari functional requirement.

---

# 43. Initial Scope Summary

Website Yayasan Daarul Ummahaat merupakan website organisasi/non-profit dengan:

* Dynamic Program Management.
* Dynamic Event Management.
* Dynamic Gallery.
* Dynamic Donation Information.
* Dynamic Impact Statistics.
* Dynamic About Content.
* Dynamic Contact Information.
* Content Management System / Admin Interface.
* Responsive Design.
* SEO.
* Performance Optimization.
* Security.
* Backup.
* WhatsApp Integration.
* Google Maps Integration.

**Technology stack bersifat fleksibel dan akan ditentukan setelah dilakukan technical exploration.**

---

# 44. Guiding Principle

> **Requirement menentukan apa yang harus dilakukan oleh website. Technology menentukan bagaimana requirement tersebut diwujudkan.**

Dokumen ini sengaja memisahkan kedua hal tersebut agar developer atau AI agent dapat mengeksplorasi beberapa architecture dan technology stack tanpa mengubah business requirements utama.
