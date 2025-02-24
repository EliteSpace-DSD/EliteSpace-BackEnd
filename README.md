# EliteSpace-BackEnd

The backend service powering the Elite Space tenant portal. This service handles digital lease management, smart device integration, complaint management, and various tenant-focused features to enhance the apartment living experience.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL hosted on Supabase
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth

## Features

- Digital lease management system
- Smart lock integration and access control
- Complaint management with AI-based escalation
- Smart package locker system integration
- Parking permit management
- Guest access management

## 🚀 Getting Started

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/EliteSpace-DSD/EliteSpace-BackEnd.git
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
``` 
DATABASE_URL=[your-database-connection-url]
```

4. Start the development server:
```bash
npm run start
```
Your server will run at [http://localhost:3000](http://localhost:3000)

## 🌳 Git Branching & Workflow
🔹 Creating branch from JIRA
1. Go to the JIRA issue you're working on
2. Click on "Create branch" in Jira (on the issue page)
3. Go to the terminal and run: `git fetch`
4. Switch to the newly created branch: `git checkout ES-21-Create-README`

This automatically links your branch, commits and PRs to the JIRA issue.

🔹 Creating a branch manually
If creating manually, always branch from main:
````
git checkout main
git pull
git checkout -b <issue-key>-<short-description>
````

Example: `git checkout -b ES-21-Create-README`

Include the Jira issue key (e.g., ES-21) to automatically link your branch to the issue. This helps track progress, commits, and PRs directly in Jira.


## 🔄 Committing Changes (Conventional Commits)

### Use Conventional Commit messages for consistency:

Format: ```git commit -m "<type>(optional scope): <description>"```

Examples:
```
git commit -m "feat(guest): add temporary guest parking feature"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs(readme): update local setup instructions"
```

### Commit Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Style-related changes
- refactor: Code refactoring
- chore: Maintenance tasks
- test: Adding/improving tests


Read more here: https://www.conventionalcommits.org/en/v1.0.0/ 

## 🔀 Pushing & Merging Branches
1. Rebase Your Branch (Before Pushing)

Before pushing your changes, ensure your branch is up-to-date with main:
```
git checkout main
git pull origin main

git checkout <your-branch-name>
git rebase main
```
Resolve any conflicts if they arise.

Continue rebasing after resolving conflicts:
```
git add .
git rebase --continue
```

2. Push Your Branch

`git push origin <your-branch-name>`


3. Open a Pull Request (PR):
- Navigate to GitHub repo.
- Click Compare & pull request.
- Provide a descriptive title and description.
- Link the related JIRA issue (e.g., APT-101).

4. Request a Review:
- Assign the PR to a reviewer (1 leads and 1 other team member).
- Address comments promptly.
- How to add meaningful comments during code review: https://conventionalcomments.org/

5. Merge After Approval:
- Merge using Squash and Merge option.
- Delete your branch after merging.


## 💬 Comments & Documentation
Inline Comments: Use clear comments to explain complex logic.

PR Descriptions: Always include what was done, why, and how to test. Screenshot of the visual change is always reccommended. 

Example PR Description:

```
### Description:
Adds endpoint to create a temporary guest parking passes in db.

### How to test:
- Open an HTTP client (HTTPie, Postman, Thunder Client vscode extension).
- Make a POST request to /parking.
- Verify 201 response received with correct parking pass details.

```