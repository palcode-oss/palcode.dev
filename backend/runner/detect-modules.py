from os import listdir
from os.path import isfile, join
import ast
import sys
import importlib

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

remote_imports = []
for module_name in imports:
  if module_name + '.py' not in files:
    try:
      importlib.import_module(module_name)
    except:
      remote_imports.append(module_name)

with open('/usr/src/app/requirements.txt', 'w') as f:
  for module_name in remote_imports:
    f.write(module_name + "\n")

if len(remote_imports) != 0:
  print('YES')
  sys.exit(0)
else:
  print('NO')
  sys.exit(0)
