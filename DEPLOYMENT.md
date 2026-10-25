# Permanent NEW.COM hosting — GitHub Pages

The complete deployment is committed in `docs/` on branch `arena/305052c4-nur`. The source app and its local preview configuration are unchanged.

## One-time setting (repository owner)

Open https://github.com/sabinayesminhussain2-boop/Nur-/settings/pages

Under **Build and deployment**:

1. Source: **Deploy from a branch**
2. Branch: **arena/305052c4-nur**
3. Folder: **/docs**
4. Click **Save**.

GitHub will build the deployment and show the live URL in that same settings page, typically within a few minutes. The expected address is https://sabinayesminhussain2-boop.github.io/Nur-/ — this is NOT live or verified until Pages has been enabled and deployment succeeds.

The connected GitHub integration returned HTTP 403 (`Resource not accessible by integration`) when attempting to enable Pages, so that one setting requires the repository owner's browser session. No credentials need to be shared with the agent.

## Updating the deployment

Run `node scripts/prepare-pages.mjs`, then commit and push the updated `docs/` on the same branch. The script uses Vite's project-site base path and rewrites generated image/model paths for `/Nur-/`. Original source files are not rewritten. Keep `docs/.nojekyll`.

## Alternative static hosting

`exports/NEW-COM-static-site.zip` contains the root-path production website. Extract it and upload its contents to a static host. It includes all fonts, images and GLB models; no backend or environment secrets are needed. For GitHub's `/Nur-/` path use `docs/`, not that root-path ZIP.

## Boundaries

The contact form downloads a draft; no message delivery service is connected. The images are AI-generated and the interactive vehicles are simplified concept GLBs. HTTPS hosting preserves all existing interactive features, subject to WebGL support on the visitor's device.
