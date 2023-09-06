'use strict';
// Sample expenses array
const expenses = [
  {category: 'Food', amount: 50},
  {category: 'Transportation', amount: 30},
  {category: 'Entertainment', amount: 20},
];

// TODO: Implement the calculateTotalExpenses function
const calculateTotalExpenses = (expenses) => {
  // TODO: Use the reduce function to calculate total expenses
  const total = expenses.reduce((total, expense) => total + expense.amount, 0);
  /*let total = 0;
  for (const expense of expenses) {
    total += expense.amount;
  }*/
  return total;
};

// Test the calculateTotalExpenses function
const totalExpenses = calculateTotalExpenses(expenses);
console.log(totalExpenses);

// Output should be:
// 100
