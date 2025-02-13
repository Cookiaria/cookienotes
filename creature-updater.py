import os

creatures_dir = './assets/creatures/'
creatures_file = './assets/creatures.txt'

def normalize_path(path):
    return path.lstrip('!*<^ ')

existing_lines = []
if os.path.exists(creatures_file):
    with open(creatures_file, 'r') as file:
        existing_lines = file.readlines()

comments = [line for line in existing_lines if line.strip().startswith('//')]
file_entries = [line for line in existing_lines if not line.strip().startswith('//')]

existing_paths = set(normalize_path(line.strip()) for line in file_entries if line.strip())

new_files = set()
for filename in os.listdir(creatures_dir):
    if os.path.isfile(os.path.join(creatures_dir, filename)):
        full_path = os.path.join('/assets/creatures', filename).replace('\\', '/')
        new_files.add(full_path)

files_to_add = new_files - existing_paths
files_to_remove = existing_paths - new_files

if files_to_add or files_to_remove:
    with open(creatures_file, 'w') as file:
        for comment in comments:
            file.write(comment)
        
        for line in file_entries:
            if normalize_path(line.strip()) not in files_to_remove:
                file.write(line)
        
        if files_to_add:
            file.write('\n')
            for file_path in sorted(files_to_add):
                file.write(f"{file_path}\n")
    
    if files_to_add:
        print(f"Added {len(files_to_add)} new files to creatures.txt.")
    if files_to_remove:
        print(f"Removed {len(files_to_remove)} deleted files from creatures.txt.")
else:
    print("No changes needed.")
