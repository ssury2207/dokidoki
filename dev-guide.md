Want to work on something? Create an issue with the US and assign to yourself.

Prompt  
-------------------------

I want you to create a clean and minimal user story in markdown format.

As a [user persona],  
I want to [briefly describe what the feature does or enables],  
So that [briefly explain the user benefit or goal].

Below is my feature description:  
[Paste your feature details here — what happens, expected behavior, UI logic, conditions, etc.]

Only include:
- The user story in plain language
- Clear feature behavior exactly as described (don’t add extra UI features or assumptions)
- Deliverables
- Test criteria (table format)

Do not add any unnecessary technical jargon, frameworks, or new suggestions.

-------------------------

PR Acceptance Rules

# Pull Request Guidelines

These rules are not enforced, but following them will help you grow as a solid and dependable developer.

## 1. No inline styles  
Avoid writing styles directly inside JSX.  
Don’t: `style={{ margin: 10, color: 'red' }}`  
Do: Use `StyleSheet.create()` or a separate style file.

## 2. No console logs or debugger  
All debug code should be removed before pushing.  
Don’t: `console.log()`, `debugger`, or `print()` statements in your code.  
Do: Clean the code before making a pull request.

## 3. No commented-out code  
Don't leave commented logic or old code in the PR.  
Don’t: `// const oldValue = someFunction()`  
Do: Delete unused code. Git keeps the history.

## 4. Each file should do one thing only  
Split components or logic into multiple files when needed.  
Don’t: Mix unrelated components or logic in the same file.  
Do: Keep your files focused and organized.

## 5. Use clear and consistent naming  
Use descriptive names that explain the purpose.  
Do: `uploadPhoto`, `userName`, `handleSubmit`  
Don’t: `x`, `data1`, `tempFunc`

## 6. No hardcoded values  
Move fixed values to constants or config files.  
Don’t: `"https://api.example.com"` or `margin: 12` directly in code.  
Do: Use named constants like `API_URL`, `DEFAULT_MARGIN`.

## 7. Use existing components when available  
Re-use before re-creating.  
Do: Check the project for an existing button, card, or input.  
Don’t: Create a duplicate component that already exists.

------

# UI Reference Guide – Spacing & Typography

Use this file when designing or building screens to ensure a consistent, clean, and responsive UI across your React Native app.

## Spacing Guide (Padding & Margin)

| Label   | Size (px) | Usage Example                                 |
|---------|-----------|------------------------------------------------|
| xs      | 4         | Small gaps between icons, tags, chips         |
| sm      | 8         | Small padding/margin inside components        |
| md      | 16        | Standard padding for screens, cards, buttons  |
| lg      | 24        | Vertical spacing between sections or blocks   |
| xl      | 32        | Extra spacing between cards or major elements |
| 2xl     | 40        | Top/bottom padding for entire screen layout   |

Quick Tips:
- Use `md (16px)` for horizontal padding on all screens.
- Use `lg (24px)` between major blocks (e.g., card to form, list to CTA).
- Stick to the scale — avoid using non-standard values like 13, 17, 27.

## Typography Guide

| Style     | Font Size (px) | Font Weight | Usage Example                        |
|-----------|----------------|-------------|--------------------------------------|
| Display   | 28–32          | Bold        | Large splash titles or headers       |
| Title     | 22–24          | Semi-bold   | Screen titles, card headers          |
| Subtitle  | 18–20          | Medium      | Section headers, form labels         |
| Body      | 14–16          | Regular     | Paragraphs, descriptions, form text  |
| Caption   | 12             | Regular     | Helper text, meta info, small labels |

Line Height Suggestions:
- Display → 36
- Title → 30
- Subtitle → 26
- Body → 22
- Caption → 16

## Usage Summary

When unsure, follow these general rules:

- Need screen padding? Use `16 (md)`
- Spacing between sections? Use `24 (lg)`
- Writing a heading? Use the `Title` style
- Writing descriptive or content text? Use the `Body` style
- Helper or hint text? Use the `Caption` style

Stick to these rules for a clean, maintainable, and visually consistent app UI.
