const fs = require('fs');

let css = fs.readFileSync('css/style.css', 'utf8');

const target = `  /* About Section Action Buttons */
  .about-actions-row {`;

const insertion = `  /* Recipe Community & Upload Mobile Styles */
  .recipe-callout-actions {
    flex-direction: column;
    width: 100%;
    gap: 10px;
  }

  .recipe-callout-actions .btn-upload-recipe-trigger,
  .recipe-callout-actions .btn-ghost-green,
  .recipe-callout-actions .btn-admin-pill {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .recipe-callout-preview {
    max-width: 100% !important;
    width: 100% !important;
  }

  .action-bar-right {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  .action-bar-right .btn-upload-recipe-main,
  .action-bar-right .btn-admin-pill {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  .admin-recipe-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-recipe-thumb {
    width: 100% !important;
    height: 140px !important;
  }

  .admin-recipe-actions {
    width: 100%;
    flex-direction: column;
  }

  .admin-recipe-actions button {
    width: 100%;
    justify-content: center;
    text-align: center;
  }

  /* About Section Action Buttons */
  .about-actions-row {`;

if (css.includes(target) && !css.includes('.action-bar-right .btn-upload-recipe-main')) {
  css = css.replace(target, insertion);
  fs.writeFileSync('css/style.css', css, 'utf8');
  console.log('Successfully inserted mobile rules for recipes into style.css');
}

let open = (css.match(/\{/g) || []).length;
let close = (css.match(/\}/g) || []).length;
console.log('CSS Braces:', open, close, open === close ? 'BALANCED' : 'ERROR');
