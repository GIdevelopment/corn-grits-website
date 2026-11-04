const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('applications.html', 'utf8');
const js = fs.readFileSync('js/main.js', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');

const checks = [
  { name: 'index.html has recipe callout', pass: index.includes('recipe-community-callout') },
  { name: 'index.html has upload modal', pass: index.includes('id="recipeUploadModal"') },
  { name: 'index.html has admin modal', pass: index.includes('id="recipeAdminModal"') },
  { name: 'index.html has detail modal', pass: index.includes('id="recipeDetailModal"') },
  { name: 'index.html has success modal', pass: index.includes('id="recipeSubmitSuccessModal"') },
  { name: 'applications.html has action bar', pass: app.includes('community-recipes-action-bar') },
  { name: 'applications.html has community recipes grid', pass: app.includes('id="communityRecipesGrid"') },
  { name: 'applications.html has upload modal', pass: app.includes('id="recipeUploadModal"') },
  { name: 'applications.html has admin modal', pass: app.includes('id="recipeAdminModal"') },
  { name: 'applications.html has detail modal', pass: app.includes('id="recipeDetailModal"') },
  { name: 'js/main.js has initRecipeCommunity call', pass: js.includes('initRecipeCommunity();') },
  { name: 'js/main.js has initRecipeCommunity definition', pass: js.includes('function initRecipeCommunity()') },
  { name: 'css/style.css has recipe callout styles', pass: css.includes('.recipe-community-callout') },
  { name: 'css/style.css has community grid styles', pass: css.includes('.community-recipes-grid') },
  { name: 'css/style.css has dropzone styles', pass: css.includes('.recipe-dropzone') },
  { name: 'css/style.css has admin styles', pass: css.includes('.admin-recipe-item') },
  { name: 'css/style.css has detail styles', pass: css.includes('.recipe-detail-box') }
];

let allPassed = true;
checks.forEach(c => {
  console.log((c.pass ? '✅ PASS' : '❌ FAIL') + ': ' + c.name);
  if (!c.pass) allPassed = false;
});

if (allPassed) {
  console.log('\n🎉 ALL CHECKS PASSED PERFECTLY!');
} else {
  console.error('\n⚠️ SOME CHECKS FAILED!');
  process.exit(1);
}

