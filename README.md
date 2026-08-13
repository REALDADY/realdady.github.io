# Amin — Professional Portfolio

A production portfolio presenting public products, private enterprise systems,
infrastructure programs, SAP / ERP work, cybersecurity and digital
transformation case studies.

## Project structure

- `app/project-data.ts` — reusable project, status and case-study data
- `app/page.tsx` — homepage, full work index and case-study interactions
- `app/globals.css` — responsive design, architecture visuals and motion
- `public/projects/` — verified captures of the four public deployments
- `app/work/page.tsx` — Sites-compatible full-work route

The Vercel deployment uses the static Vite build. The vinext build remains
available for the Sites-compatible application output.

## Commands

```bash
npm run dev
npm run build
npm run build:vercel
```
