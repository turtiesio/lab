#!/usr/bin/env python3

import sys
import os
from datetime import date
import re

def to_snake_case(name):
    """Converts a string to snake case."""
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def register_project(name, purpose, date_started, date_modified):
    """Registers a project in the README.md file under the # Projects heading."""
    
    snake_case_name = to_snake_case(name)

    # Create a markdown table row with a link to the project directory
    row = f"| [{name}](projects/{snake_case_name}) | {purpose} | {date_started} | {date_modified} |"

    # Check if the README.md file exists
    if not os.path.exists("README.md"):
        print("Error: README.md not found.")
        sys.exit(1)

    # Check for duplicate project names
    with open("README.md", "r") as f:
        content = f.read()
        if f"| [{name}](projects/{snake_case_name}) |" in content:
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

def update_project(name):
    """Updates the 'Date Modified' column for a project in the README.md file."""
    today = date.today().strftime("%Y-%m-%d")
    snake_case_name = to_snake_case(name)
    
    if not os.path.exists("README.md"):
        print("Error: README.md not found.")
        sys.exit(1)
    
    with open("README.md", "r+") as f:
        lines = f.readlines()
        updated = False
        for i, line in enumerate(lines):
            if f"| [{name}](projects/{snake_case_name}) |" in line:
                parts = line.split("|")
                if len(parts) == 5:
                    parts[4] = f" {today} |"
                    lines[i] = "|".join(parts) + "\n"
                    updated = True
                    break
        if not updated:
            print(f"Error: Project '{name}' not found in README.md")
            sys.exit(1)
        f.seek(0)
        f.writelines(lines)
    print(f"Project '{name}' modified date updated to {today}.")


if __name__ == "__main__":
    today = date.today().strftime("%Y-%m-%d")
    if len(sys.argv) < 2:
        print("Usage: register_project.py <register|update> [project_name] [project_purpose] [date_started] [date_modified]")
        sys.exit(1)

    action = sys.argv[1]

    if action == "register":
        if len(sys.argv) != 5:
            name = input("Enter project name: ")
            purpose = input("Enter project purpose: ")
            date_started = today
            date_modified = today
        else:
            name = sys.argv[2]
            purpose = sys.argv[3]
            date_started = sys.argv[4]
            date_modified = today
        
        # Create project directory
        projects_dir = "projects"
        if not os.path.exists(projects_dir):
            os.makedirs(projects_dir)
        
        snake_case_name = to_snake_case(name)
        project_path = os.path.join(projects_dir, snake_case_name)
        if not os.path.exists(project_path):
            os.makedirs(project_path)
            print(f"Directory '{project_path}' created successfully.")
        else:
            print(f"Directory '{project_path}' already exists.")

        register_project(name, purpose, date_started, date_modified)
    elif action == "update":
        if len(sys.argv) != 3:
             name = input("Enter project name to update: ")
        else:
            name = sys.argv[2]
        update_project(name)
    else:
        print("Invalid action. Use 'register' or 'update'.")
        sys.exit(1)
