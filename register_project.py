#!/usr/bin/env python3

import sys
import os
from datetime import date

def register_project(name, purpose, date_started, date_modified):
    """Registers a project in the README.md file under the # Projects heading."""

    # Create a markdown table row
    row = f"| {name} | {purpose} | {date_started} | {date_modified} |"

    # Check if the README.md file exists
    if not os.path.exists("README.md"):
        print("Error: README.md not found.")
        sys.exit(1)

    # Check for duplicate project names
    with open("README.md", "r") as f:
        content = f.read()
        if f"| {name} |" in content:
            print(f"Error: Project '{name}' already registered.")
            sys.exit(1)
    
    # Append the new project information to the README.md file
    with open("README.md", "r+") as f:
        lines = f.readlines()
        
        project_heading_found = False
        for i, line in enumerate(lines):
            if line.strip() == "# Projects":
                lines.insert(i + 1, row + "\n")
                project_heading_found = True
                break
        
        if not project_heading_found:
            lines.append(row + "\n")
        
        f.seek(0)
        f.writelines(lines)


    print(f"Project '{name}' registered successfully.")


if __name__ == "__main__":
    today = date.today().strftime("%Y-%m-%d")
    if len(sys.argv) != 5:
        name = input("Enter project name: ")
        purpose = input("Enter project purpose: ")
        date_started = today
        date_modified = today
    else:
        name = sys.argv[1]
        purpose = sys.argv[2]
        date_started = sys.argv[3]
        date_modified = sys.argv[4]

    # Create project directory
    if not os.path.exists(name):
        os.makedirs(name)
        print(f"Directory '{name}' created successfully.")
    else:
        print(f"Directory '{name}' already exists.")

    register_project(name, purpose, date_started, date_modified)
