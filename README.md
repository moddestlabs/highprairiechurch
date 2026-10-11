# High Prairie Church Website

Modern, fast, static website for [High Prairie Church](https://highprairiechurch.org) (Leavenworth, KS), built with [Astro](https://astro.build), hosted on [GitHub Pages](https://pages.github.com), and managed with [Pages CMS](https://pagescms.org).

---

## Architecture & Features

* **Zero Server Hosting:** Runs entirely on GitHub Pages ($0/month forever).
* **Automatic Cloud Deployment:** Pushing any change to `main` triggers a GitHub Actions workflow that builds and publishes the site in ~30 seconds.
* **Non-Technical CMS:** Configured with [Pages CMS](https://pagescms.org) (`.pages.yml`) for publishing weekly bulletins, sermons, and announcements directly via GitHub.
* **Archived Content:** Includes complete historical archive of 66+ sermons converted into structured Markdown content collections (`src/content/sermons/`).
* **Integrations:** Embedded [Zeffy](https://www.zeffy.com) 100% free online giving system and Google Maps.

---

## Managing Content via Pages CMS

Church staff and volunteers can manage sermons and bulletins without touching any code:

1. Go to **[pagescms.org](https://pagescms.org)**
2. Click **Sign in with GitHub**
3. Select the `moddestlabs/highprairiechurch` repository
4. **Publish Weekly Bulletins:** Go to **Weekly Bulletins** -> Click *New* -> Upload the Sunday bulletin scans (Cover, Inside, Insert/Notes) -> Click *Save & Publish*.
5. **Add Sermons:** Go to **Sermons** -> Enter title, date, scripture, notes -> Click *Save & Publish*.

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Switching to Custom Domain (`highprairiechurch.org`)

When you are ready to point the Porkbun domain name:

1. **Update `astro.config.mjs`:**
   Change:
   ```javascript
   export default defineConfig({
     site: 'https://highprairiechurch.org',
     // remove or comment out base: '/highprairiechurch'
   });
   ```
2. **In GitHub Repository Settings:**
   Go to **Settings** -> **Pages** -> **Custom domain** -> Enter `highprairiechurch.org`.
3. **In Porkbun DNS:**
   Add GitHub Pages A records:
   * `185.199.108.153`
   * `185.199.109.153`
   * `185.199.110.153`
   * `185.199.111.153`
   * CNAME `www` pointing to `moddestlabs.github.io`
