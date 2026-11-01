# Image Workflow & Preservation

This directory (`originals/images/`) stores the **unmodified, full-resolution source images** (camera uploads, high-res scans, originals).

## How it works

1. **Add new images:**
   Place any new full-resolution original image into `originals/images/`.
2. **Run optimization:**
   ```bash
   npm run optimize-images
   ```
3. **Web-ready versions:**
   The optimizer automatically resizes oversized images and creates high-efficiency web versions in `public/images/`.
   - Your originals in this directory remain **100% untouched and pristine**.
   - The web version in `public/images/` stays ultra-lightweight (saving ~90% bandwidth for visitors).

## Optimization Defaults
- **Staff / Portrait photos:** Max 800×800 px, high-quality mozjpeg.
- **Hero banners & gallery photos:** Max 1600×1600 px (retaining aspect ratio), high-quality mozjpeg.
- **PNG photos:** Max 1600×1600 px, palette & deflate compressed.
- **Icons & Logos:** Kept at native dimensions with maximum lossless compression.

