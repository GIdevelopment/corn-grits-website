// Test simulation of recipe community logic
const DEFAULT_RECIPES = [
  {
    id: 'rec_101',
    title: 'Spicy Cajun Shrimp & Golden Grits',
    status: 'approved'
  },
  {
    id: 'rec_102',
    title: 'Crispy Pan-Seared Rosemary Grit Cakes',
    status: 'approved'
  }
];

let memoryStorage = JSON.stringify(DEFAULT_RECIPES);

function getRecipes() {
  return JSON.parse(memoryStorage);
}

function saveRecipes(data) {
  memoryStorage = JSON.stringify(data);
}

// 1. Initial State
let list = getRecipes();
let approvedBefore = list.filter(r => r.status === 'approved');
let pendingBefore = list.filter(r => r.status === 'pending');
console.log('Initial approved:', approvedBefore.length, 'pending:', pendingBefore.length);
if (approvedBefore.length !== 2 || pendingBefore.length !== 0) throw new Error('Init state failed');

// 2. User submits a new recipe
const userSubmission = {
  id: 'rec_' + Date.now(),
  title: 'Smoked Gouda & Roasted Corn Grits',
  author: 'Chef Tanvi',
  category: 'Savory Mains & Bowls',
  grade: 'Grits 108',
  prepTime: '25 Mins',
  servings: '4 Servings',
  image: 'images/recipes/cheese-grits.jpg',
  ingredients: '1 cup Grits 108\n1 cup Smoked Gouda\n2 cups Milk',
  instructions: '1. Cook grits.\n2. Fold in gouda.',
  status: 'pending', // Starts as pending!
  createdAt: new Date().toISOString()
};

list.unshift(userSubmission);
saveRecipes(list);

// Check public grid: new recipe must NOT be visible yet!
list = getRecipes();
let approvedAfterUpload = list.filter(r => r.status === 'approved');
let pendingAfterUpload = list.filter(r => r.status === 'pending');
console.log('After upload approved:', approvedAfterUpload.length, 'pending:', pendingAfterUpload.length);
if (approvedAfterUpload.length !== 2) throw new Error('Unapproved recipe appeared prematurely on public grid!');
if (pendingAfterUpload.length !== 1) throw new Error('Pending count mismatch!');

// 3. Admin approves the recipe
const target = list.find(r => r.id === userSubmission.id);
target.status = 'approved';
target.approvedAt = new Date().toISOString();
saveRecipes(list);

// Check public grid: now it MUST be visible!
list = getRecipes();
let approvedAfterAdmin = list.filter(r => r.status === 'approved');
let pendingAfterAdmin = list.filter(r => r.status === 'pending');
console.log('After admin approval approved:', approvedAfterAdmin.length, 'pending:', pendingAfterAdmin.length);
if (approvedAfterAdmin.length !== 3) throw new Error('Approved recipe did not appear on public grid!');
if (pendingAfterAdmin.length !== 0) throw new Error('Pending count should be 0 after approval!');

console.log('All simulation assertions PASSED!');

