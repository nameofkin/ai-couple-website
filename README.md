# AI Couple — Free Website Starter

A responsive, mobile-friendly romantic photo/video generator interface built with HTML, CSS, JavaScript and a small Express server.

## What works now
- Responsive landing page and style cards
- Photo upload, drag-and-drop, preview and file validation (JPG/PNG/WebP, max 8 MB)
- Photo/video mode switch, style selection and optional prompt
- Frontend calls `/api/generate-image` and `/api/generate-video`
- Clear error state when no AI provider is configured
- Uploads are not stored in a database by this starter

## Important: real AI generation requires a provider
This starter does **not** pretend to generate AI content without an AI service. The server routes deliberately return a clear configuration message. Choose an image/video provider whose terms allow your intended use, then implement its current API schema inside `server.js`. Provider model names, input fields, output formats, prices, and consent rules change; check the provider's current documentation.

Keep provider API keys on the server as environment variables. Never paste secret keys into `public/app.js`, HTML, or a public Git repository. For image-to-video, confirm the chosen provider accepts uploaded image input. Many services charge per image or video; a free website does not mean the generation API is free.

## Run locally
1. Install Node.js 18 or newer.
2. Unzip this folder.
3. In this folder run:
   ```bash
   npm install
   npm start
   ```
4. Open `http://localhost:3000`.

## Connect an AI provider
1. Pick a provider and model for image generation and a separate image-to-video model if needed.
2. Read its API docs and confirm its rules for adult users, consent, retention and image uploads.
3. Implement the API request in `POST /api/generate-image` and `POST /api/generate-video` in `server.js`.
4. Store API keys in hosting environment variables, not frontend code.
5. Return JSON such as `{ "url": "https://provider.example/result-file" }` after the provider reports the job complete. For asynchronous video jobs, poll the provider server-side and return the final result URL only when ready.
6. Add authentication/rate limits, usage caps, file-size/type checks, abuse reporting, timeouts and server-side cleanup before making it public.

## Free hosting
### Option A: Render (Node server)
1. Push this folder to a GitHub repository.
2. Create a Web Service on Render and connect that repository.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add provider keys under the service's environment variables once integration is implemented.
6. Deploy and test on the generated HTTPS URL.

### Option B: Railway or another Node host
Use the same GitHub deployment flow, set `npm install` as build and `npm start` as start command. Check the provider's current free-tier limits; free plans and credit policies can change.

### Static-only hosting note
GitHub Pages, Netlify static hosting and similar static hosts can serve the frontend, but this project needs a server for secret API keys and generation routes. Do not call paid AI APIs directly from browser code. Deploy the Node server too, or adapt the backend to a secure serverless function.

## Before launch
- Add a proper privacy policy that identifies the operator and AI providers.
- Require users to confirm they are adults and have consent from everyone pictured.
- Prohibit non-consensual intimate imagery, minors, impersonation and uploads without permission.
- Tell users whether the AI provider receives and retains uploaded images.
- Provide deletion/reporting procedures and protect result URLs.
- Add rate limits and a cost budget so public visitors cannot run up API charges.
- Use HTTPS and test on Android Chrome.
- Review local laws, app/hosting policies, and the AI provider's terms.

## Project structure
```
ai-couple-website/
  package.json
  server.js
  public/
    index.html
    style.css
    app.js
  README.md
```
