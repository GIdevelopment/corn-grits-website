const fs = require('fs');

// 1. Read files
let styleCss = fs.readFileSync('css/style.css', 'utf8');
let mainJs = fs.readFileSync('js/main.js', 'utf8');
let indexHtml = fs.readFileSync('index.html', 'utf8');
let appHtml = fs.readFileSync('applications.html', 'utf8');

// 2. CSS to append to style.css
const RECIPE_CSS = `
/* --------------------------------------------------------------------------
   11b. Community Recipes & Recipe Upload Feature
   -------------------------------------------------------------------------- */
.recipe-community-callout {
  background: linear-gradient(135deg, #FFF9EE 0%, #F6ECDA 50%, #ECE0C7 100%);
  border: 1.5px solid #E2CCA8;
  border-radius: 20px;
  padding: clamp(24px, 3.5vw, 36px);
  margin-top: 34px;
  box-shadow: 0 10px 28px rgba(18, 43, 30, 0.06);
  position: relative;
  overflow: hidden;
}

.recipe-community-callout::before {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(250, 166, 26, 0.22) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}

.recipe-callout-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}

.recipe-callout-content {
  flex: 1 1 480px;
  max-width: 660px;
}

.recipe-callout-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFFFFF;
  color: #8C5E11;
  border: 1px solid #E4CDA6;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 12px;
  border-radius: 50px;
  margin-bottom: 10px;
}

.recipe-callout-title {
  font-size: clamp(1.4rem, 2.5vw, 1.95rem);
  font-weight: 800;
  color: var(--color-forest);
  margin: 0 0 10px;
  line-height: 1.25;
}

.recipe-callout-desc {
  font-size: 0.94rem;
  color: #4D5950;
  line-height: 1.65;
  margin: 0 0 20px;
}

.recipe-callout-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.recipe-callout-preview {
  flex: 0 1 320px;
  width: 100%;
  max-width: 320px;
}

.btn-upload-recipe-trigger,
.btn-upload-recipe-main {
  background: linear-gradient(135deg, #FAA61A 0%, #F5970B 100%);
  color: #142416 !important;
  font-weight: 800;
  font-size: 0.92rem;
  padding: 10px 22px;
  border-radius: 50px;
  border: 1.5px solid #F5970B;
  box-shadow: 0 4px 14px rgba(250, 166, 26, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
}

.btn-upload-recipe-trigger:hover,
.btn-upload-recipe-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(250, 166, 26, 0.5);
  background: linear-gradient(135deg, #FFB53A 0%, #FAA61A 100%);
}

.btn-admin-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #FFFFFF;
  color: var(--color-forest);
  border: 1.5px solid #D5CEBE;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(18, 43, 30, 0.05);
}

.btn-admin-pill:hover {
  border-color: var(--color-forest);
  background: #F4EFE6;
  transform: translateY(-1px);
}

.admin-pending-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #E53E3E;
  color: #FFFFFF;
  font-size: 0.72rem;
  font-weight: 800;
  border-radius: 50px;
  line-height: 1;
}

.admin-pending-count.is-zero {
  background: #718096;
}

/* Community Recipes Action Bar in applications.html */
.community-recipes-action-bar {
  background: linear-gradient(135deg, #163E28 0%, #1D4B31 60%, #133321 100%);
  border-radius: 18px;
  padding: 22px 26px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 10px;
  margin-bottom: 24px;
  border: 1.5px solid rgba(250, 166, 26, 0.35);
  box-shadow: 0 8px 24px rgba(18, 43, 30, 0.15);
}

.action-bar-badge {
  display: inline-block;
  background: rgba(250, 166, 26, 0.2);
  color: #FAA61A;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 10px;
  border-radius: 50px;
  margin-bottom: 6px;
  border: 1px solid rgba(250, 166, 26, 0.35);
}

.action-bar-title {
  color: #FFFFFF;
  font-size: 1.45rem;
  font-weight: 800;
  margin: 0 0 4px;
}

.action-bar-subtitle {
  color: #CFDDD4;
  font-size: 0.88rem;
  margin: 0;
}

.action-bar-right {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* Community Recipes Grid */
.community-recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
  gap: 22px;
  margin-bottom: 30px;
}

.community-recipe-card {
  background: #FFFFFF;
  border-radius: 18px;
  overflow: hidden;
  border: 1.5px solid #EBE3D3;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
  box-shadow: 0 4px 16px rgba(18, 43, 30, 0.04);
}

.community-recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 32px rgba(18, 43, 30, 0.1);
  border-color: rgba(250, 166, 26, 0.5);
}

.badge-chef-approved {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #163E28 0%, #1F5234 100%);
  color: #FAA61A;
  border: 1px solid rgba(250, 166, 26, 0.5);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  z-index: 2;
}

.recipe-author-byline {
  font-size: 0.82rem;
  color: #637166;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-view-recipe {
  width: 100%;
  background: #FAF8F2;
  border: 1.5px solid #E2D7C3;
  color: var(--color-forest);
  font-weight: 700;
  font-size: 0.85rem;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
  margin-top: 14px;
}

.btn-view-recipe:hover {
  background: var(--color-forest);
  color: #FFFFFF;
  border-color: var(--color-forest);
}

/* Modals layout & controls */
.recipe-upload-modal-content,
.recipe-admin-modal-content,
.recipe-detail-modal-content {
  max-width: 760px;
}

/* Dropzone & Image Preview in Upload Modal */
.recipe-dropzone {
  border: 2px dashed #D6CABA;
  border-radius: 12px;
  background: #FAF8F2;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 10px;
}

.recipe-dropzone:hover,
.recipe-dropzone.is-dragover {
  border-color: var(--color-gold);
  background: #FFF9ED;
}

.recipe-photo-preview-wrap {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 10px;
  overflow: hidden;
  background: #1B3E29;
  margin-top: 10px;
  display: none;
}

.recipe-photo-preview-wrap.has-photo {
  display: block;
}

.recipe-photo-preview-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-photo {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: #FFFFFF;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.recipe-presets-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.recipe-preset-btn {
  background: #FFFFFF;
  border: 1px solid #D5CEBD;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 50px;
  color: #37473C;
  cursor: pointer;
  transition: all 0.15s ease;
}

.recipe-preset-btn:hover,
.recipe-preset-btn.is-selected {
  background: #FFF5DD;
  border-color: #FAA61A;
  color: #8C5E11;
  font-weight: 700;
}

/* Admin Dashboard Modal Specifics */
.admin-tabs-bar {
  display: flex;
  gap: 8px;
  border-bottom: 1.5px solid #EAE3D4;
  margin-bottom: 18px;
  padding-bottom: 10px;
}

.admin-tab-btn {
  background: none;
  border: none;
  font-size: 0.88rem;
  font-weight: 700;
  color: #6E7972;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.admin-tab-btn.is-active {
  background: var(--color-forest);
  color: #FFFFFF;
}

.admin-recipe-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 480px;
  overflow-y: auto;
  padding-right: 4px;
}

.admin-recipe-item {
  background: #FAF8F2;
  border: 1.5px solid #E7DDCB;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  transition: border-color 0.2s ease;
}

.admin-recipe-item.is-pending {
  border-left: 5px solid #FAA61A;
  background: #FFFBF2;
}

.admin-recipe-item.is-approved {
  border-left: 5px solid #163E28;
}

.admin-recipe-thumb {
  width: 90px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #234732;
}

.admin-recipe-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin-recipe-info {
  flex: 1 1 240px;
}

.admin-recipe-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-admin-approve {
  background: #163E28;
  color: #FFFFFF;
  border: 1px solid #163E28;
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-admin-approve:hover {
  background: #1E5034;
}

.btn-admin-reject {
  background: #FFF0F0;
  color: #C53030;
  border: 1px solid #FEB2B2;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-admin-reject:hover {
  background: #E53E3E;
  color: #FFFFFF;
}

.btn-admin-preview {
  background: #FFFFFF;
  color: #2F3E33;
  border: 1px solid #D5CEBE;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-admin-preview:hover {
  background: #F4EFE4;
}

/* Recipe Detail Modal specifics */
.recipe-detail-header-img {
  width: 100%;
  height: clamp(200px, 30vh, 320px);
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 18px;
  background: #11311F;
}

.recipe-detail-header-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 20px;
  margin-top: 16px;
}

@media (max-width: 680px) {
  .recipe-detail-grid {
    grid-template-columns: 1fr;
  }
}

.recipe-detail-box {
  background: #FAF8F2;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #EBE2D2;
}

.recipe-detail-box-title {
  font-size: 0.84rem;
  font-weight: 800;
  color: var(--color-forest);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recipe-detail-ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recipe-detail-ingredients-list li {
  font-size: 0.86rem;
  color: #38463D;
  padding: 6px 0;
  border-bottom: 1px dashed #E5DBCA;
  display: flex;
  align-items: center;
  gap: 6px;
}

.recipe-detail-ingredients-list li:last-child {
  border-bottom: none;
}

.recipe-detail-steps-list {
  padding-left: 20px;
  margin: 0;
  font-size: 0.86rem;
  color: #38463D;
  line-height: 1.6;
}

.recipe-detail-steps-list li {
  margin-bottom: 10px;
}
`;

// Append CSS
styleCss = styleCss + '\n' + RECIPE_CSS;
fs.writeFileSync('css/style.css', styleCss, 'utf8');
console.log('Appended RECIPE_CSS to css/style.css');

