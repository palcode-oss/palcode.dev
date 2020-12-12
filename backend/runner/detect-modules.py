from os import listdir
from os.path import isfile, join
import ast
import sys

files = [f for f in listdir('/usr/src/app') if isfile(join('/usr/src/app', f))]
imports = []

for file_name in files:
  if file_name.endswith('.py'):
    f = open(join('/usr/src/app', file_name))
    file_contents = ast.parse(f.read())

    for node in ast.iter_child_nodes(file_contents):
      if isinstance(node, ast.Import):
        for subnode in node.names:
          imports.append(subnode.name)
      elif isinstance(node, ast.ImportFrom):
        imports.append(node.module)

contains_remote_imports = False
for module_name in imports:
  if module_name + '.py' not in files:
    contains_remote_imports = True

if contains_remote_imports:
  print('YES')
  sys.exit(0)
else:
  print('NO')
  sys.exit(0)
