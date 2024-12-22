#!/usr/bin/env python3

import os
import sys
import datetime
import re

def get_last_modified_date(path):
    """Gets the last modified date of a directory."""
    timestamp = os.path.getmtime(path)
    return datetime.datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")

def update_readme(projects_dir):
    """Updates the README.md file with the last modified dates of projects."""
    if not os.path.exists("README.md"):
        print("Error: README.md not found.")
        sys.exit(1)

    with open("README.md", "r") as f:
        lines = f.readlines()

    updated_lines = lines[:]
    project_heading_found = False
    
    project_lines_start = -1
    for i, line in enumerate(lines):
        if line.strip() == "## Projects":
            project_heading_found = True
            project_lines_start = i + 1
            break
    
    if not project_heading_found:
        print("Error: # Projects heading not found in README.md")
        sys.exit(1)

    for project_dir in os.listdir(projects_dir):
        project_path = os.path.join(projects_dir, project_dir)
        if os.path.isdir(project_path):
            last_modified_date = get_last_modified_date(project_path)
            
            for j in range(project_lines_start, len(updated_lines)):
                line = updated_lines[j]
                # Extract project name from the markdown link in README.md
                project_name_match = re.search(r"\| \[(.+?)\]\(projects\/" + re.escape(project_dir) + r"\) \|", line)
                if project_name_match:
                    project_name = project_name_match.group(1)
                    parts = line.split("|")
                    if len(parts) == 6:
                        parts[4] = f" {last_modified_date} "
                        updated_lines[j] = "|".join(parts)
                    break

    with open("README.md", "w") as f:
        f.writelines(updated_lines)

    print("README.md updated successfully.")

if __name__ == "__main__":
    projects_dir = "projects"
    update_readme(projects_dir)
