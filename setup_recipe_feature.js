const fs = require('fs');

console.log('--- Starting Recipe Community Feature Installation ---');

// 1. Modals HTML
const RECIPE_MODALS_HTML = `
  <!-- ==========================================
       COMMUNITY RECIPES MODALS (Upload, Admin, Detail, Success)
       ========================================== -->

  <!-- 1. Recipe Upload Modal -->
  <div id="recipeUploadModal" class="modal-overlay" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="recipeUploadTitle">
    <div class="modal-card recipe-upload-modal-content">
      <button class="modal-close" data-close-modal="recipeUpload" aria-label="Close upload dialog">&times;</button>
      
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 0.78rem; font-weight: 800; color: #FAA61A; text-transform: uppercase; letter-spacing: 0.08em;">Culinary Community</span>
        <h3 id="recipeUploadTitle" style="color: #163E28; font-size: 1.6rem; font-weight: 800; margin-top: 2px;">Upload Your Recipe</h3>
        <p style="font-size: 0.86rem; color: #5B665E; margin-top: 4px;">Share your signature corn grits creation &bull; Published live on CornGrits.in upon admin approval</p>
      </div>

      <form id="recipeUploadForm">
        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label" for="recipeTitle">Recipe Title *</label>
            <input type="text" id="recipeTitle" class="form-control" required placeholder="e.g. Crispy Rosemary Grit Croquettes">
          </div>
          <div class="form-group">
            <label class="form-label" for="recipeAuthor">Chef / Author Name *</label>
            <input type="text" id="recipeAuthor" class="form-control" required placeholder="e.g. Chef Anita Roy">
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label" for="recipeCategory">Dish Category *</label>
            <select id="recipeCategory" class="form-control" required>
              <option value="Breakfast &amp; Porridge">🥣 Breakfast &amp; Porridge</option>
              <option value="Savory Mains &amp; Bowls" selected>🍲 Savory Mains &amp; Bowls</option>
              <option value="Crispy Snacks &amp; Appetizers">🍿 Crispy Snacks &amp; Appetizers</option>
              <option value="Italian Polenta &amp; Fine Dining">🍝 Italian Polenta &amp; Fine Dining</option>
              <option value="Bakery, Breads &amp; Desserts">🥖 Bakery, Breads &amp; Desserts</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="recipeGrade">Corn Grits Grade Used *</label>
            <select id="recipeGrade" class="form-control" required>
              <option value="Grits 101 (Coarse / Flaking)" selected>Grits 101 (Coarse / Flaking)</option>
              <option value="Grits 101A (Brewer's Low-Fat)">Grits 101A (Brewer's Low-Fat)</option>
              <option value="Grits 108 (Medium Granulation)">Grits 108 (Medium Granulation)</option>
              <option value="Grits 112 (Fine Cut)">Grits 112 (Fine Cut)</option>
              <option value="Corn Meal / Coarse Flour">Corn Meal / Coarse Flour</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label class="form-label" for="recipePrepTime">Prep &amp; Cooking Time *</label>
            <input type="text" id="recipePrepTime" class="form-control" required placeholder="e.g. 25 Mins">
          </div>
          <div class="form-group">
            <label class="form-label" for="recipeServings">Servings *</label>
            <input type="text" id="recipeServings" class="form-control" required placeholder="e.g. 4 Servings">
          </div>
        </div>

        <!-- Photo Upload Box -->
        <div class="form-group">
          <label class="form-label">Recipe Dish Photo</label>
          <div class="recipe-dropzone" id="recipeDropZone">
            <input type="file" id="recipePhotoFile" accept="image/*" style="display: none;">
            <div id="recipeDropZonePrompt">
              <span style="font-size: 1.8rem; display: block; margin-bottom: 4px;">📷</span>
              <strong style="color: var(--color-forest); font-size: 0.9rem;">Click or drag &amp; drop to upload a dish photo</strong>
              <div style="font-size: 0.78rem; color: #718076; margin-top: 2px;">PNG, JPG, WebP up to 5MB</div>
            </div>
            <div id="recipePhotoPreviewWrap" class="recipe-photo-preview-wrap">
              <img id="recipePhotoPreviewImg" src="" alt="Recipe preview">
              <button type="button" class="btn-remove-photo" id="btnRemovePhoto" title="Remove photo">&times;</button>
            </div>
          </div>
          <div style="font-size: 0.76rem; color: #6E7B71; margin-top: 4px;">
            Or select a curated dish style:
            <div class="recipe-presets-row" id="recipePresetPills">
              <button type="button" class="recipe-preset-btn" data-img="images/recipes/shrimp-and-grits.jpg">🦐 Shrimp &amp; Grits</button>
              <button type="button" class="recipe-preset-btn" data-img="images/recipes/fried-grit-cakes.jpg">🫓 Grit Cakes</button>
              <button type="button" class="recipe-preset-btn" data-img="images/recipes/cheese-grits.jpg">🧀 Cheese Grits</button>
              <button type="button" class="recipe-preset-btn" data-img="images/recipes/honey-butter-grits.jpg">🍯 Honey Bowl</button>
              <button type="button" class="recipe-preset-btn" data-img="images/applications/italian-polenta.jpg">🍝 Polenta</button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="recipeIngredients">Key Ingredients * (one per line)</label>
          <textarea id="recipeIngredients" class="form-control" rows="3" required placeholder="e.g.&#10;1 cup Coarse Corn Grits 101&#10;3 cups Broth / Water&#10;1 cup Whole Milk&#10;1.5 cups Sharp Cheddar Cheese&#10;3 tbsp Butter&#10;Salt &amp; Pepper to taste"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label" for="recipeInstructions">Cooking Instructions / Steps *</label>
          <textarea id="recipeInstructions" class="form-control" rows="4" required placeholder="e.g.&#10;1. Bring broth and milk to a rolling simmer.&#10;2. Whisk in grits gradually in a slow steady stream.&#10;3. Simmer covered on low heat for 20 minutes until velvety.&#10;4. Fold in cheese and butter off the heat. Serve steaming hot!"></textarea>
        </div>

        <!-- Moderation Notice -->
        <div style="background: #FFF9ED; border: 1px solid #E8D5B5; border-radius: 10px; padding: 10px 14px; margin-bottom: 16px; font-size: 0.82rem; color: #6A5222; display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-size: 1.1rem; line-height: 1;">🛡️</span>
          <span><strong>Admin Review Workflow:</strong> To maintain high culinary standards, your recipe enters a pending state upon submission. Once verified by our culinary administrator, it is published live in our community gallery!</span>
        </div>

        <button type="submit" class="btn-know-more" style="width: 100%; justify-content: center; padding: 13px; font-size: 0.98rem; font-weight: 800;">
          <span>🚀 Submit Recipe for Admin Approval &rarr;</span>
        </button>
      </form>
    </div>
  </div>

  <!-- 2. Recipe Submission Success Modal -->
  <div id="recipeSubmitSuccessModal" class="modal-overlay" aria-hidden="true" role="dialog" aria-modal="true">
    <div class="modal-card" style="max-width: 520px; text-align: center; padding: 36px 28px;">
      <div style="font-size: 3rem; margin-bottom: 10px;">🎉</div>
      <span style="font-size: 0.78rem; font-weight: 800; color: #FAA61A; text-transform: uppercase; letter-spacing: 0.08em;">Submission Received</span>
      <h3 style="color: #163E28; font-size: 1.55rem; font-weight: 800; margin: 6px 0 10px;">Recipe Sent for Admin Approval!</h3>
      <p style="font-size: 0.9rem; color: #4D5950; line-height: 1.6; margin-bottom: 18px;">
        Thank you, <strong id="successAuthorName">Chef</strong>! Your recipe <strong id="successRecipeTitle">"..."</strong> is now recorded and placed in <strong>pending review</strong>.
      </p>
      <div style="background: #FAF8F2; border: 1px dashed #D5CEBE; border-radius: 12px; padding: 14px 16px; margin-bottom: 22px; font-size: 0.84rem; color: #435147; text-align: left;">
        <strong>Admin Approval Demo:</strong><br>
        You can open the culinary admin moderation panel right now to review, approve, and watch this recipe appear live on the website!
      </div>
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button type="button" class="btn-admin-pill" id="btnSuccessOpenAdmin" style="padding: 10px 20px; font-size: 0.88rem; background: var(--color-forest); color: #FFFFFF; border-color: var(--color-forest);">
          <span>🔑 Open Admin Review Panel &rarr;</span>
        </button>
        <button type="button" class="btn-know-more" id="btnSuccessClose" style="padding: 10px 20px; font-size: 0.88rem;">
          <span>Done</span>
        </button>
      </div>
    </div>
  </div>

  <!-- 3. Recipe Admin Moderation Panel Modal -->
  <div id="recipeAdminModal" class="modal-overlay" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="adminModalTitle">
    <div class="modal-card recipe-admin-modal-content">
      <button class="modal-close" data-close-modal="recipeAdmin" aria-label="Close admin dialog">&times;</button>
      
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: #FAA61A; text-transform: uppercase; letter-spacing: 0.08em;">Moderator Control Panel</span>
          <h3 id="adminModalTitle" style="color: #163E28; font-size: 1.55rem; font-weight: 800; margin: 2px 0 0;">Recipe Moderation &amp; Approval</h3>
        </div>
        <span style="background: #FFF8E7; border: 1px solid #FAA61A; padding: 4px 12px; border-radius: 50px; font-size: 0.78rem; color: #7A5B18; font-weight: 800;">
          🛡️ Admin Role: Active
        </span>
      </div>

      <!-- Admin Tab Filter -->
      <div class="admin-tabs-bar">
        <button type="button" class="admin-tab-btn is-active" data-admin-tab="pending">
          <span>⏳ Pending Review (<span class="admin-pending-count">0</span>)</span>
        </button>
        <button type="button" class="admin-tab-btn" data-admin-tab="approved">
          <span>✅ Published Live (<span id="adminApprovedCount">0</span>)</span>
        </button>
      </div>

      <div style="font-size: 0.82rem; color: #627065; margin-bottom: 14px;">
        Review submissions below. Click <strong>"Approve &amp; Publish Live"</strong> to immediately publish a recipe to the website, or <strong>"Reject"</strong> to decline.
      </div>

      <!-- Recipe Items List -->
      <div id="adminRecipeList" class="admin-recipe-list">
        <!-- Rendered dynamically via JS -->
      </div>
    </div>
  </div>

  <!-- 4. Recipe Full Detail Modal -->
  <div id="recipeDetailModal" class="modal-overlay" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="detailRecipeTitle">
    <div class="modal-card recipe-detail-modal-content">
      <button class="modal-close" data-close-modal="recipeDetail" aria-label="Close detail dialog">&times;</button>
      
      <div class="recipe-detail-header-img">
        <img id="detailRecipeImg" src="" alt="">
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 6px;">
        <span id="detailRecipeCategory" class="action-bar-badge" style="margin: 0;"></span>
        <span id="detailRecipeGrade" class="recipe-tag-grade" style="margin: 0;"></span>
      </div>

      <h3 id="detailRecipeTitle" style="color: #163E28; font-size: 1.6rem; font-weight: 800; margin: 4px 0;"></h3>
      <div id="detailRecipeMeta" class="recipe-meta-row" style="margin-bottom: 16px;"></div>

      <div class="recipe-detail-grid">
        <div class="recipe-detail-box">
          <div class="recipe-detail-box-title">
            <span>🥗 Key Ingredients</span>
          </div>
          <ul id="detailRecipeIngredients" class="recipe-detail-ingredients-list"></ul>
        </div>
        <div class="recipe-detail-box">
          <div class="recipe-detail-box-title">
            <span>👨‍🍳 Cooking Instructions</span>
          </div>
          <ol id="detailRecipeInstructions" class="recipe-detail-steps-list"></ol>
        </div>
      </div>

      <div style="margin-top: 20px; text-align: center;">
        <button type="button" class="btn-ghost-green" data-close-modal="recipeDetail" style="padding: 9px 24px;">
          <span>Close Recipe &times;</span>
        </button>
      </div>
    </div>
  </div>
`;

// 2. Index.html updates
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Insert callout into index.html inside #applications
const indexTarget = `<div style="text-align: center; margin-top: 26px;">
          <a href="applications.html" class="btn-know-more">
            <span>Explore All 5 Applications in Detail &rarr;</span>
          </a>
        </div>`;

const indexCallout = `
        <div style="text-align: center; margin-top: 26px;">
          <a href="applications.html" class="btn-know-more">
            <span>Explore All 5 Applications in Detail &rarr;</span>
          </a>
        </div>

        <!-- Community Recipe Showcase & Upload Callout -->
        <div class="recipe-community-callout">
          <div class="recipe-callout-inner">
            <div class="recipe-callout-content">
              <span class="recipe-callout-pill">🍳 Culinary Community &bull; Share Your Creation</span>
              <h3 class="recipe-callout-title">Have a Secret Corn Grits Recipe?</h3>
              <p class="recipe-callout-desc">
                From velvety cheddar polenta to crispy street-style grit croquettes &mdash; share your favorite corn grits dish with food lovers across the world! Submit your recipe with steps &amp; photo; once approved by our culinary admin, it will appear live on CornGrits.in.
              </p>
              <div class="recipe-callout-actions">
                <button type="button" class="btn-upload-recipe-trigger" data-open-modal="recipeUpload">
                  <span>🍳 Upload Your Recipe &rarr;</span>
                </button>
                <a href="applications.html#recipes" class="btn-ghost-green">
                  <span>👨‍🍳 Browse Community Recipes</span>
                </a>
                <button type="button" class="btn-admin-pill" data-open-modal="recipeAdmin" title="Culinary Admin Moderation Panel">
                  <span>🔑 Admin Review (<span class="admin-pending-count">0</span>)</span>
                </button>
              </div>
            </div>
            <div class="recipe-callout-preview">
              <div id="homeRecipePreview">
                <!-- Dynamically populated featured recipe card -->
              </div>
            </div>
          </div>
        </div>`;

if (indexHtml.includes(indexTarget) && !indexHtml.includes('recipe-community-callout')) {
  indexHtml = indexHtml.replace(indexTarget, indexCallout);
  console.log('Added recipe-community-callout to index.html');
}

// Insert modals into index.html before script
if (!indexHtml.includes('id="recipeUploadModal"')) {
  indexHtml = indexHtml.replace('  <!-- Master JavaScript -->\n  <script src="js/main.js"></script>', RECIPE_MODALS_HTML + '\n  <!-- Master JavaScript -->\n  <script src="js/main.js"></script>');
  console.log('Added RECIPE_MODALS_HTML to index.html');
}
fs.writeFileSync('index.html', indexHtml, 'utf8');

// 3. Applications.html updates
let appHtml = fs.readFileSync('applications.html', 'utf8');

const appTarget = `<section id="recipes" class="recipes-section">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="color: var(--color-gold); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Culinary Excellence</span>
          <h2 style="font-size: 1.85rem; color: var(--color-forest); margin-top: 4px;">Authentic Recipes Made From Corn Grits</h2>
          <p style="color: #5B665E; font-size: 0.95rem; max-width: 720px; margin: 6px auto 0;">
            From comforting morning porridges to world-famous Southern savories and crispy pan-fried delicacies &mdash; discover how easy it is to transform corn grits into extraordinary culinary dishes at home or in commercial kitchens:
          </p>
        </div>`;

const appReplacement = `<section id="recipes" class="recipes-section">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="color: var(--color-gold); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Culinary Excellence</span>
          <h2 style="font-size: 1.85rem; color: var(--color-forest); margin-top: 4px;">Authentic Recipes Made From Corn Grits</h2>
          <p style="color: #5B665E; font-size: 0.95rem; max-width: 720px; margin: 6px auto 0;">
            From comforting morning porridges to world-famous Southern savories and crispy pan-fried delicacies &mdash; discover how easy it is to transform corn grits into extraordinary culinary dishes at home or in commercial kitchens:
          </p>
        </div>

        <!-- Community Recipes Action Bar -->
        <div class="community-recipes-action-bar">
          <div class="action-bar-left">
            <span class="action-bar-badge">🌟 Global Culinary Hub</span>
            <h3 class="action-bar-title">Corn Grits Community Recipes</h3>
            <p class="action-bar-subtitle">Real recipes submitted by passionate chefs, home cooks, and food innovators worldwide.</p>
          </div>
          <div class="action-bar-right">
            <button type="button" class="btn-upload-recipe-main" data-open-modal="recipeUpload">
              <span>🍳 Upload Your Recipe &rarr;</span>
            </button>
            <button type="button" class="btn-admin-pill" data-open-modal="recipeAdmin" title="Culinary Admin Moderation Panel">
              <span>🔑 Admin Review (<span class="admin-pending-count">0</span>)</span>
            </button>
          </div>
        </div>

        <!-- Dynamic Community Recipes Grid (Shows approved community recipes) -->
        <div id="communityRecipesGrid" class="community-recipes-grid">
          <!-- Dynamically populated via JS -->
        </div>

        <div style="text-align: center; margin: 38px 0 22px;">
          <span style="display: inline-block; height: 1px; width: 60px; background: #D5CEBE; vertical-align: middle; margin-right: 12px;"></span>
          <span style="font-size: 0.85rem; font-weight: 800; color: #7A5B18; text-transform: uppercase; letter-spacing: 0.08em;">Signature Kitchen Classics</span>
          <span style="display: inline-block; height: 1px; width: 60px; background: #D5CEBE; vertical-align: middle; margin-left: 12px;"></span>
        </div>`;

if (appHtml.includes(appTarget) && !appHtml.includes('community-recipes-action-bar')) {
  appHtml = appHtml.replace(appTarget, appReplacement);
  console.log('Added community-recipes-action-bar to applications.html');
}

// Insert modals into applications.html before script
if (!appHtml.includes('id="recipeUploadModal"')) {
  appHtml = appHtml.replace('  <script src="js/main.js"></script>', RECIPE_MODALS_HTML + '\n  <script src="js/main.js"></script>');
  console.log('Added RECIPE_MODALS_HTML to applications.html');
}
fs.writeFileSync('applications.html', appHtml, 'utf8');

console.log('HTML files successfully updated!');

