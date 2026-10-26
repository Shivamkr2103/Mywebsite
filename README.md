# Shivam Kumar — Developer Portfolio

A responsive personal portfolio built with plain HTML, CSS, and JavaScript.

## Files
- `index.html` — page structure and content
- `style.css` — gradient theme, responsive layout, animations, project illustrations
- `script.js` — mobile navigation, reveal animations, current year, contact-form validation

## Run locally
1. Download or extract the project folder.
2. Open `index.html` in a browser. For a better development workflow, open the folder in VS Code and use the Live Server extension.

## Personalise before publishing
1. Edit the name, introduction, skills, and project descriptions in `index.html`.
2. Add your real GitHub/LinkedIn URLs and repository links where appropriate.
3. In `script.js`, replace `your-email@example.com` with the email address you want to receive messages at. The contact form uses `mailto:`; it opens the visitor's email application and does not send messages through a backend.
4. Test the layout on mobile and desktop.

## Deploy on GitHub Pages
1. Create a GitHub repository, for example `shivam-portfolio`.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository root and commit.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. Wait for the deployment link to appear in the Pages section.

## Deploy on Netlify
1. Sign in to Netlify and choose **Add new site → Deploy manually**.
2. Drag the extracted project folder into the deployment area, or import the GitHub repository.
3. No build command is required for this static site.

## Notes
- Google Fonts are loaded from Google Fonts; a system-font fallback is provided.
- The contact form is front-end only. For direct message submissions, connect a form service or build a backend.
