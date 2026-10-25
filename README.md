# Addu Dive Hub

Static website for Addu Dive Hub in Addu Atoll, Maldives.

## Website files

- `index.html` — main public website. The page styles and most interactive behavior are included in this file.
- `admin.html` — photo-management page. Access is controlled by Supabase Auth and Storage policies; the page being unlisted is not a security boundary.
- `styles.css`, `script.js`, `logo.svg` — additional assets retained in the repository. The current `index.html` is self-contained and does not depend on the separate CSS/JS files.

## Features and service dependencies

- Booking requests open WhatsApp at the configured business number; this does not confirm availability or create a booking record.
- The contact form opens the visitor's email app using a `mailto:` link; it does not send mail from a server.
- The public photo gallery reads from the Supabase Storage bucket `Dive-photo`.
- Reviews and review-account sign-in use the configured BOLI app integration.
- Social links are included in the Contact section.

## Free GitHub Pages deployment

This repository is public, so GitHub Pages can host the static site on an eligible free plan.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Push to `main` or manually run the **Deploy static site to GitHub Pages** workflow from the Actions tab.
4. After the workflow succeeds, open the site URL shown in the deployment environment.

The workflow publishes the repository's static files from the root; no package install or build command is required.

### Custom domain

A custom domain must also be configured under **Settings → Pages** and at the domain registrar. Do not assume the domain is live until GitHub Pages reports it as configured and HTTPS is available. For an apex domain, follow GitHub's current DNS instructions: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Before launch

- Verify the public website loads over HTTPS.
- Test the WhatsApp booking link and contact email link on a phone.
- Confirm Supabase photo reads work and that only the intended admin account can upload/delete photos.
- Test BOLI review sign-up, sign-in, password recovery, submission, and public display.
- Never commit Supabase secret/service-role keys or passwords. The publishable key in the browser is only safe when backend policies enforce the intended access.
