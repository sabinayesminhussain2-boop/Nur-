"""Create source + production ZIPs without dependencies or private repository data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
output = root / 'exports'
output.mkdir(exist_ok=True)
files = ['README.md', '.gitignore', 'index.html', 'package.json', 'package-lock.json', 'tsconfig.json', 'vite.config.ts']
with ZipFile(output / 'NEW-COM-project.zip', 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(root / name, 'NEW-COM/' + name)
    for directory in ['src', 'public', 'scripts', 'dist']:
        for path in sorted((root / directory).rglob('*')):
            if path.is_file():
                archive.write(path, 'NEW-COM/' + str(path.relative_to(root)))
with ZipFile(output / 'NEW-COM-static-site.zip', 'w', ZIP_DEFLATED) as archive:
    for path in sorted((root / 'dist').rglob('*')):
        if path.is_file():
            archive.write(path, str(path.relative_to(root / 'dist')))
for path in output.glob('*.zip'):
    with ZipFile(path) as archive:
        assert archive.testzip() is None
    print(f'{path}: {path.stat().st_size:,} bytes — verified')
