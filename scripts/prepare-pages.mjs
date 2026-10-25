// Prepare a project-site deployment without changing the existing app or assets.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
execFileSync('npm', ['run','build','--','--base=/Nur-/','--outDir=docs'], {stdio:'inherit'});
for (const name of readdirSync('docs/assets')) {
 if (!name.endsWith('.js')) continue;
 const path=join('docs/assets',name);
 const code=readFileSync(path,'utf8');
 writeFileSync(path,code.replaceAll('/images/','/Nur-/images/').replaceAll('/models/','/Nur-/models/'));
}
writeFileSync('docs/.nojekyll','');
console.log('GitHub Pages deployment prepared in docs/. Source application unchanged.');
