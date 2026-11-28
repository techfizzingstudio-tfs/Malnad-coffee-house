# Malnad Coffee House

The site uses TanStack Start, React and Nitro. Use Node 24 LTS. Run `npm ci` and `npm run dev` locally. Use `npm run build` followed by `npm run preview` to serve the production Node build. To build Vercel artifacts locally, run `NITRO_PRESET=vercel npm run build`.

## MongoDB publishing on Vercel

Import the repository into Vercel with the TanStack Start preset. Set the following server environment variables in Vercel or in an ignored local `.env` for `npm run dev`.

- `DB_URL` — MongoDB connection string. Allow the Vercel runtime network access to the database.
- `DB_NAME` — database name (defaults to `coffee-house`).
- `ADMIN_TOKEN` — a long randomly generated secret shared with authorized editors.

Existing deployments using `MONGODB_URI` and `MONGODB_DB` can keep those names. With only `MONGODB_URI` set, the database name defaults to `malnad`.

Open `/admin/`, enter the admin token and publish a blog post or FAQ. Using the same identifier replaces the complete entry. Article bodies use plain text with blank lines between paragraphs.

The journal, article and FAQ pages read MongoDB on each request. A saved entry appears on the next request. The rest of the site is pre-rendered. Bundled samples are available when a connection string is absent, and database entries with matching identifiers override those samples.
