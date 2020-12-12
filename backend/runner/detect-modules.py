from os import listdir
from os.path import isfile, join
import ast
import sys

files = [f for f in listdir('/usr/src/app') if isfile(join('/usr/src/app', f))]
using_imports = False

for fileName in files:
  if fileName.endswith('.py'):
    f = open(join('/usr/src/app', fileName))
    file_contents = ast.parse(f.read())

    for node in ast.iter_child_nodes(file_contents):
      if isinstance(node, ast.ImportFrom) or isinstance(node, ast.Import):
        using_imports = True

if using_imports:
  print('YES')
  sys.exit(0)
else:
  print('NO')
  sys.exit(0)
