# SBA 308 - JavaScript Fundamentals

## Description

This project is a JavaScript data processing script that analyzes learner submission data for a given course. 

The main function, `getLearnerData()`, processes the raw data and returns a formatted array of objects — one per learner — showing how they performed across all assignments that are currently due.

## Features

- Validates that the assignment group belongs to the correct course, throwing an error if not
- Skips assignments that are not yet due (based on today's date)
- Applies a 10% late penalty to submissions turned in after the due date
- Uses `try/catch` blocks to handle unexpected or malformed data gracefully

## How to Run

1. Clone this repository
2. Open `index.js` in your terminal or browser console
3. Run the script using Node.js:

```bash
node index.js
```

The output will be logged to the console as an array.

## Technologies Used

- JavaScript (ES6+)
- Node.js


SBA 308 - Per Scholas