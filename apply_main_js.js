const fs = require('fs');

let mainJs = fs.readFileSync('js/main.js', 'utf8');

// 1. Add initRecipeCommunity() call to DOMContentLoaded if not present
if (!mainJs.includes('initRecipeCommunity();')) {
  mainJs = mainJs.replace('initGradeTabs();', 'initGradeTabs();\n  initRecipeCommunity();');
  console.log('Added initRecipeCommunity() to DOMContentLoaded');
}

// 2. Define initRecipeCommunity function implementation
const RECIPE_JS = `
/* --------------------------------------------------------------------------
   10. Community Recipes & Admin Approval Workflow
   -------------------------------------------------------------------------- */
function initRecipeCommunity() {
  const STORAGE_KEY = 'corngrits_community_recipes';

  const DEFAULT_RECIPES = [
    {
      id: 'rec_101',
      title: 'Spicy Cajun Shrimp & Golden Grits',
      author: 'Chef Marcus Vance',
      category: 'Savory Mains & Bowls',
      grade: 'Grits 101 (Coarse / Flaking)',
      prepTime: '30 Mins',
      servings: '4 Servings',
      image: 'images/recipes/shrimp-and-grits.jpg',
      ingredients: '1 lb Fresh Jumbo Shrimp (peeled & deveined)\\n1 cup Coarse Corn Grits 101\\n4 slices Thick Smoked Bacon\\n3 cloves Minced Garlic\\n1 tbsp Cajun Creole Seasoning\\n1 cup Whole Milk\\n3 cups Chicken Broth\\n2 tbsp Unsalted Butter\\n2 tbsp Sliced Green Scallions\\nFresh Lemon Wedges',
      instructions: '1. In a heavy saucepan, bring chicken broth and whole milk to a rolling boil. Whisk in coarse corn grits in a steady stream to avoid lumps.\\n2. Lower heat to minimum, cover tightly, and simmer for 25 minutes, stirring occasionally until velvety and thick. Whisk in 1 tbsp butter and pinch of salt.\\n3. In a large skillet over medium-high heat, fry chopped bacon until crisp. Remove bacon with a slotted spoon, keeping the flavorful drippings in the pan.\\n4. Toss shrimp with cajun seasoning. Sauté in the hot bacon drippings for 2 minutes per side until pink and succulent. Stir in minced garlic and lemon juice for 30 seconds.\\n5. Spoon warm golden grits into bowls, top with sautéed cajun shrimp, drizzle garlic butter pan sauce, and garnish with crisp bacon and scallions.',
      status: 'approved',
      createdAt: '2026-10-28T10:00:00Z',
      approvedAt: '2026-10-28T10:30:00Z'
    },
    {
      id: 'rec_102',
      title: 'Crispy Pan-Seared Rosemary Grit Cakes',
      author: 'Chef Elena Rossi • Trattoria Rustica',
      category: 'Crispy Snacks & Appetizers',
      grade: 'Grits 108 (Medium Granulation)',
      prepTime: '20 Mins + Chill',
      servings: '6 Servings',
      image: 'images/recipes/fried-grit-cakes.jpg',
      ingredients: '1 cup Corn Grits 108 (Medium)\\n3.5 cups Seasoned Vegetable Broth\\n1/2 cup Freshly Grated Parmesan Cheese\\n1 tbsp Fresh Rosemary (finely chopped)\\n2 tbsp Extra Virgin Olive Oil\\n1 tbsp Farm Butter\\nFlaky Maldon Sea Salt & Coarse Black Pepper',
      instructions: '1. Bring vegetable broth to a boil in a medium pot. Whisk in medium corn grits and cook over low heat for 18 minutes until very thick.\\n2. Remove from heat; fold in grated parmesan, chopped rosemary, butter, salt, and freshly ground black pepper.\\n3. Line an 8x8 inch baking dish with parchment and lightly grease. Spread the hot grits into an even 3/4-inch thick layer. Refrigerate for 45 minutes until firm and chilled.\\n4. Invert onto a cutting board and cut into neat triangles or squares.\\n5. Heat olive oil in a cast-iron skillet over medium-high heat. Fry grit cakes for 4–5 minutes per side without crowding until deeply golden and crackling crisp. Drain on paper towels, sprinkle with flaky sea salt, and serve with garlic aioli or tomato coulis.',
      status: 'approved',
      createdAt: '2026-10-29T14:00:00Z',
      approvedAt: '2026-10-29T14:45:00Z'
    }
  ];

  // Storage Helpers
  function getRecipes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECIPES));
        return DEFAULT_RECIPES.slice();
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECIPES));
        return DEFAULT_RECIPES.slice();
      }
      return parsed;
    } catch (e) {
      return DEFAULT_RECIPES.slice();
    }
  }

  function saveRecipes(recipes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to save recipes to localStorage', e);
    }
  }

  // Update Badge Counts
  function updateBadges() {
    const recipes = getRecipes();
    const pendingCount = recipes.filter(r => r.status === 'pending').length;
    const approvedCount = recipes.filter(r => r.status === 'approved').length;

    document.querySelectorAll('.admin-pending-count').forEach(el => {
      el.textContent = pendingCount;
      el.classList.toggle('is-zero', pendingCount === 0);
    });

    const approvedEl = document.querySelector('#adminApprovedCount');
    if (approvedEl) {
      approvedEl.textContent = approvedCount;
    }
  }

  // Modal Open/Close Management
  const openModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.remove('is-active');
    // If no other modals active, restore overflow
    if (!document.querySelector('.modal-overlay.is-active')) {
      document.body.style.overflow = '';
    }
  };

  // Close buttons and click outside
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      const target = document.querySelector('#' + modalId + 'Modal') || btn.closest('.modal-overlay');
      closeModal(target);
    });
  });

  const uploadModal = document.querySelector('#recipeUploadModal');
  const adminModal = document.querySelector('#recipeAdminModal');
  const detailModal = document.querySelector('#recipeDetailModal');
  const successModal = document.querySelector('#recipeSubmitSuccessModal');

  [uploadModal, adminModal, detailModal, successModal].forEach(m => {
    if (!m) return;
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        closeModal(m);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [uploadModal, adminModal, detailModal, successModal].forEach(m => {
        if (m && m.classList.contains('is-active')) closeModal(m);
      });
    }
  });

  // Open triggers for Upload & Admin
  document.querySelectorAll('[data-open-modal="recipeUpload"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(uploadModal);
    });
  });

  document.querySelectorAll('[data-open-modal="recipeAdmin"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      renderAdminList('pending');
      openModal(adminModal);
    });
  });

  // Success dialog buttons
  const btnSuccessClose = document.querySelector('#btnSuccessClose');
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => closeModal(successModal));
  }

  const btnSuccessOpenAdmin = document.querySelector('#btnSuccessOpenAdmin');
  if (btnSuccessOpenAdmin) {
    btnSuccessOpenAdmin.addEventListener('click', () => {
      closeModal(successModal);
      renderAdminList('pending');
      openModal(adminModal);
    });
  }

  // Render Community Recipes Grid (applications.html)
  function renderCommunityGrid() {
    const grid = document.querySelector('#communityRecipesGrid');
    if (!grid) return;

    const recipes = getRecipes().filter(r => r.status === 'approved');

    if (recipes.length === 0) {
      grid.innerHTML = \`
        <div style="grid-column: 1 / -1; background: #FAF8F2; border: 1.5px dashed #D5CEBE; border-radius: 16px; padding: 36px 20px; text-align: center;">
          <span style="font-size: 2.2rem; display: block; margin-bottom: 8px;">🍳</span>
          <strong style="color: var(--color-forest); font-size: 1.1rem; display: block; margin-bottom: 6px;">No Community Recipes Published Yet</strong>
          <p style="font-size: 0.88rem; color: #5B665E; max-width: 460px; margin: 0 auto 16px;">Be the first chef or home cook to share your favorite corn grits dish with the community!</p>
          <button type="button" class="btn-know-more btn-upload-recipe-main" data-open-modal="recipeUpload">
            <span>🍳 Upload Your Recipe &rarr;</span>
          </button>
        </div>\`;
      // Re-bind upload button
      grid.querySelectorAll('[data-open-modal="recipeUpload"]').forEach(b => {
        b.addEventListener('click', () => openModal(uploadModal));
      });
      return;
    }

    grid.innerHTML = recipes.map(r => {
      const ingLines = (r.ingredients || '')
        .split('\\n')
        .map(s => s.trim())
        .filter(Boolean);
      const ingPreview = ingLines.slice(0, 4);
      const ingRemaining = ingLines.length > 4 ? \`+\${ingLines.length - 4} more\` : '';

      return \`
        <article class="community-recipe-card" data-recipe-id="\${r.id}">
          <div class="recipe-img-wrap">
            <img src="\${r.image || 'images/recipes/cheese-grits.jpg'}" alt="\${r.title}" width="400" height="260" loading="lazy">
            <span class="recipe-badge-floating">
              <span>⏱️ \${r.prepTime || '25 Mins'}</span> &bull; <span>🍽️ \${r.servings || '4 Servings'}</span>
            </span>
            <span class="badge-chef-approved">
              <span>✨ Approved Recipe</span>
            </span>
          </div>
          <div class="recipe-content">
            <div>
              <span class="recipe-tag-grade">\${r.grade || 'Corn Grits'}</span>
              <h4 class="recipe-title" style="margin-top: 4px;">\${r.title}</h4>
              <div class="recipe-author-byline">
                <span>👨‍🍳 By <strong>\${r.author || 'Community Chef'}</strong></span>
                <span>&bull;</span>
                <span>📂 \${r.category || 'Dishes'}</span>
              </div>
              <ul class="recipe-ingredients-list" style="margin-bottom: 8px;">
                \${ingPreview.map(ing => \`<li class="recipe-ingredient-chip">\${ing}</li>\`).join('')}
                \${ingRemaining ? \`<li class="recipe-ingredient-chip" style="background: #FFF5DD; color: #8C5E11; font-weight: 700;">\${ingRemaining}</li>\` : ''}
              </ul>
            </div>
            <div>
              <button type="button" class="btn-view-recipe" data-view-recipe="\${r.id}">
                <span>View Full Recipe &amp; Cooking Steps 📖</span>
              </button>
            </div>
          </div>
        </article>
      \`;
    }).join('');

    // Bind "View Full Recipe" buttons
    grid.querySelectorAll('[data-view-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-view-recipe');
        openRecipeDetail(id);
      });
    });
  }

  // Render Homepage Preview Card (index.html)
  function renderHomePreview() {
    const previewContainer = document.querySelector('#homeRecipePreview');
    if (!previewContainer) return;

    const approvedRecipes = getRecipes().filter(r => r.status === 'approved');
    if (approvedRecipes.length === 0) {
      previewContainer.innerHTML = '';
      return;
    }

    // Pick latest approved recipe
    const latest = approvedRecipes[0];
    previewContainer.innerHTML = \`
      <div style="background: #FFFFFF; border-radius: 16px; border: 1.5px solid #E4CCA6; overflow: hidden; box-shadow: 0 8px 24px rgba(18, 43, 30, 0.08); transition: transform 0.3s ease;">
        <div style="position: relative; height: 160px; overflow: hidden; background: #163E28;">
          <img src="\${latest.image || 'images/recipes/shrimp-and-grits.jpg'}" alt="\${latest.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <span style="position: absolute; top: 10px; right: 10px; background: rgba(22, 62, 40, 0.9); color: #FAA61A; font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 50px; border: 1px solid rgba(250, 166, 26, 0.5);">
            ✨ Featured Community Recipe
          </span>
          <span style="position: absolute; bottom: 10px; left: 10px; background: rgba(0, 0, 0, 0.75); color: #FFFFFF; font-size: 0.72rem; font-weight: 700; padding: 3px 9px; border-radius: 50px;">
            ⏱️ \${latest.prepTime} &bull; 🍽️ \${latest.servings}
          </span>
        </div>
        <div style="padding: 16px;">
          <span style="font-size: 0.75rem; color: #8C5E11; font-weight: 700; background: #FFF5DD; padding: 2px 8px; border-radius: 50px; display: inline-block; margin-bottom: 6px;">
            \${latest.grade}
          </span>
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #163E28; margin: 0 0 4px; line-height: 1.3;">
            \${latest.title}
          </h4>
          <div style="font-size: 0.78rem; color: #627166; margin-bottom: 12px;">
            By <strong>\${latest.author}</strong>
          </div>
          <button type="button" class="btn-know-more" data-view-recipe="\${latest.id}" style="width: 100%; justify-content: center; padding: 8px 14px; font-size: 0.82rem;">
            <span>Read Cooking Steps 👨‍🍳</span>
          </button>
        </div>
      </div>
    \`;

    previewContainer.querySelectorAll('[data-view-recipe]').forEach(btn => {
      btn.addEventListener('click', () => {
        openRecipeDetail(latest.id);
      });
    });
  }

  // Open Recipe Detail Modal
  function openRecipeDetail(id) {
    const recipes = getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (!recipe || !detailModal) return;

    const imgEl = detailModal.querySelector('#detailRecipeImg');
    const catEl = detailModal.querySelector('#detailRecipeCategory');
    const gradeEl = detailModal.querySelector('#detailRecipeGrade');
    const titleEl = detailModal.querySelector('#detailRecipeTitle');
    const metaEl = detailModal.querySelector('#detailRecipeMeta');
    const ingListEl = detailModal.querySelector('#detailRecipeIngredients');
    const stepsListEl = detailModal.querySelector('#detailRecipeInstructions');

    if (imgEl) {
      imgEl.src = recipe.image || 'images/recipes/cheese-grits.jpg';
      imgEl.alt = recipe.title;
    }
    if (catEl) catEl.textContent = '📂 ' + (recipe.category || 'Corn Grits Recipe');
    if (gradeEl) gradeEl.textContent = '🌾 ' + (recipe.grade || 'Corn Grits');
    if (titleEl) titleEl.textContent = recipe.title;

    if (metaEl) {
      metaEl.innerHTML = \`
        <span class="recipe-meta-item">👨‍🍳 Chef: <strong>\${recipe.author || 'Community Cook'}</strong></span>
        <span class="recipe-meta-item">⏱️ Prep: <strong>\${recipe.prepTime || '25 Mins'}</strong></span>
        <span class="recipe-meta-item">🍽️ Serves: <strong>\${recipe.servings || '4'}</strong></span>
        \${recipe.status === 'approved' ? '<span class="recipe-meta-item" style="color: #276749;">✅ Live on Website</span>' : '<span class="recipe-meta-item" style="color: #D69E2E;">⏳ Pending Review</span>'}
      \`;
    }

    if (ingListEl) {
      const ings = (recipe.ingredients || '')
        .split('\\n')
        .map(s => s.trim())
        .filter(Boolean);
      ingListEl.innerHTML = ings.map(item => \`<li><span>🌽</span> <span>\${item}</span></li>\`).join('');
    }

    if (stepsListEl) {
      const steps = (recipe.instructions || '')
        .split('\\n')
        .map(s => s.trim())
        .filter(Boolean);
      stepsListEl.innerHTML = steps.map(step => {
        // Strip leading numbers if already numbered
        const cleanStep = step.replace(/^\\d+[.)]\\s*/, '');
        return \`<li>\${cleanStep}</li>\`;
      }).join('');
    }

    openModal(detailModal);
  }

  // Render Admin Review List
  let currentAdminTab = 'pending';
  function renderAdminList(tab = 'pending') {
    currentAdminTab = tab;
    const list = document.querySelector('#adminRecipeList');
    if (!list) return;

    // Update active tab buttons
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      const t = btn.getAttribute('data-admin-tab');
      btn.classList.toggle('is-active', t === tab);
    });

    const recipes = getRecipes();
    const filtered = recipes.filter(r => r.status === tab);

    updateBadges();

    if (filtered.length === 0) {
      if (tab === 'pending') {
        list.innerHTML = \`
          <div style="background: #FFFFFF; border: 1.5px dashed #C8DACF; border-radius: 12px; padding: 32px 18px; text-align: center;">
            <span style="font-size: 2rem; display: block; margin-bottom: 6px;">🎉</span>
            <strong style="color: #163E28; font-size: 1rem; display: block;">All Caught Up!</strong>
            <p style="font-size: 0.84rem; color: #5B665E; margin: 4px 0 0;">There are no recipes waiting in the pending moderation queue.</p>
          </div>
        \`;
      } else {
        list.innerHTML = \`
          <div style="background: #FFFFFF; border: 1.5px dashed #D5CEBE; border-radius: 12px; padding: 32px 18px; text-align: center;">
            <strong style="color: #163E28; font-size: 1rem; display: block;">No Published Recipes Found</strong>
            <p style="font-size: 0.84rem; color: #5B665E; margin: 4px 0 0;">Approved recipes will be displayed here.</p>
          </div>
        \`;
      }
      return;
    }

    list.innerHTML = filtered.map(r => {
      const isPending = (r.status === 'pending');
      const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently';

      return \`
        <div class="admin-recipe-item \${isPending ? 'is-pending' : 'is-approved'}" data-item-id="\${r.id}">
          <div class="admin-recipe-thumb">
            <img src="\${r.image || 'images/recipes/cheese-grits.jpg'}" alt="\${r.title}">
          </div>
          <div class="admin-recipe-info">
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
              <span style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 50px; background: \${isPending ? '#FEFCBF; color: #975A16;' : '#C6F6D5; color: #22543D;'}">
                \${isPending ? '⏳ PENDING REVIEW' : '✅ PUBLISHED LIVE'}
              </span>
              <span style="font-size: 0.75rem; color: #718076;">Submitted: \${dateStr}</span>
            </div>
            <strong style="color: #163E28; font-size: 1.05rem; display: block; margin-bottom: 2px;">\${r.title}</strong>
            <div style="font-size: 0.82rem; color: #556358;">
              By <strong>\${r.author}</strong> &bull; \${r.category} &bull; <span style="color: #8C5E11; font-weight: 600;">\${r.grade}</span>
            </div>
          </div>
          <div class="admin-recipe-actions">
            \${isPending ? \`
              <button type="button" class="btn-admin-approve" data-admin-action="approve" data-id="\${r.id}">
                <span>✅ Approve &amp; Publish Live</span>
              </button>
            \` : \`
              <button type="button" class="btn-admin-preview" data-admin-action="unpublish" data-id="\${r.id}" title="Move back to pending review">
                <span>↩️ Unpublish</span>
              </button>
            \`}
            <button type="button" class="btn-admin-preview" data-admin-action="preview" data-id="\${r.id}">
              <span>👁️ Preview</span>
            </button>
            <button type="button" class="btn-admin-reject" data-admin-action="delete" data-id="\${r.id}">
              <span>🗑️ Delete</span>
            </button>
          </div>
        </div>
      \`;
    }).join('');

    // Bind action handlers
    list.querySelectorAll('[data-admin-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-admin-action');
        const id = btn.getAttribute('data-id');
        handleAdminAction(action, id);
      });
    });
  }

  // Handle Admin Actions: Approve, Reject, Unpublish, Preview
  function handleAdminAction(action, id) {
    let recipes = getRecipes();
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    if (action === 'approve') {
      recipe.status = 'approved';
      recipe.approvedAt = new Date().toISOString();
      saveRecipes(recipes);
      updateBadges();
      renderAdminList('pending');
      renderCommunityGrid();
      renderHomePreview();

      // Show toast confirmation
      showToast(\`🎉 Approved! "\${recipe.title}" is now published live on the website!\`);
    } else if (action === 'unpublish') {
      recipe.status = 'pending';
      saveRecipes(recipes);
      updateBadges();
      renderAdminList('approved');
      renderCommunityGrid();
      renderHomePreview();
      showToast(\`Recipe moved back to pending review.\`);
    } else if (action === 'delete') {
      if (confirm(\`Are you sure you want to delete "\${recipe.title}"?\`)) {
        recipes = recipes.filter(r => r.id !== id);
        saveRecipes(recipes);
        updateBadges();
        renderAdminList(currentAdminTab);
        renderCommunityGrid();
        renderHomePreview();
        showToast(\`Recipe was removed.\`);
      }
    } else if (action === 'preview') {
      openRecipeDetail(id);
    }
  }

  // Admin Tab Switch
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-admin-tab');
      renderAdminList(tab);
    });
  });

  // Photo Upload & Preview Handling
  let currentPhotoData = null;
  const photoFileInput = document.querySelector('#recipePhotoFile');
  const dropZone = document.querySelector('#recipeDropZone');
  const dropZonePrompt = document.querySelector('#recipeDropZonePrompt');
  const previewWrap = document.querySelector('#recipePhotoPreviewWrap');
  const previewImg = document.querySelector('#recipePhotoPreviewImg');
  const btnRemovePhoto = document.querySelector('#btnRemovePhoto');
  const presetPills = document.querySelectorAll('.recipe-preset-btn');

  function setPreview(src) {
    currentPhotoData = src;
    if (previewImg) previewImg.src = src;
    if (previewWrap) previewWrap.classList.add('has-photo');
    if (dropZonePrompt) dropZonePrompt.style.display = 'none';
  }

  function clearPreview() {
    currentPhotoData = null;
    if (photoFileInput) photoFileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewWrap) previewWrap.classList.remove('has-photo');
    if (dropZonePrompt) dropZonePrompt.style.display = 'block';
    presetPills.forEach(p => p.classList.remove('is-selected'));
  }

  if (dropZone && photoFileInput) {
    dropZone.addEventListener('click', (e) => {
      if (e.target.closest('#btnRemovePhoto')) return;
      photoFileInput.click();
    });

    photoFileInput.addEventListener('change', () => {
      const file = photoFileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target.result);
        presetPills.forEach(p => p.classList.remove('is-selected'));
      };
      reader.readAsDataURL(file);
    });

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropZone.addEventListener(name, (e) => {
        e.preventDefault();
        dropZone.classList.remove('is-dragover');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreview(ev.target.result);
          presetPills.forEach(p => p.classList.remove('is-selected'));
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', (e) => {
      e.stopPropagation();
      clearPreview();
    });
  }

  // Preset Dish Style Buttons
  presetPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      presetPills.forEach(p => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      const imgPath = pill.getAttribute('data-img');
      setPreview(imgPath);
    });
  });

  // Recipe Upload Form Submission
  const uploadForm = document.querySelector('#recipeUploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.querySelector('#recipeTitle')?.value.trim();
      const author = document.querySelector('#recipeAuthor')?.value.trim();
      const category = document.querySelector('#recipeCategory')?.value;
      const grade = document.querySelector('#recipeGrade')?.value;
      const prepTime = document.querySelector('#recipePrepTime')?.value.trim();
      const servings = document.querySelector('#recipeServings')?.value.trim();
      const ingredients = document.querySelector('#recipeIngredients')?.value.trim();
      const instructions = document.querySelector('#recipeInstructions')?.value.trim();

      if (!title || !author || !ingredients || !instructions) {
        alert('Please fill in all required recipe fields.');
        return;
      }

      const newRecipe = {
        id: 'rec_' + Date.now(),
        title: title,
        author: author,
        category: category || 'Savory Mains & Bowls',
        grade: grade || 'Grits 101 (Coarse / Flaking)',
        prepTime: prepTime || '25 Mins',
        servings: servings || '4 Servings',
        image: currentPhotoData || 'images/recipes/cheese-grits.jpg',
        ingredients: ingredients,
        instructions: instructions,
        status: 'pending', // Pending admin approval!
        createdAt: new Date().toISOString()
      };

      const recipes = getRecipes();
      recipes.unshift(newRecipe);
      saveRecipes(recipes);

      // Reset form
      uploadForm.reset();
      clearPreview();
      closeModal(uploadModal);

      // Update badge counters immediately
      updateBadges();

      // Show Success Modal
      if (successModal) {
        const authorEl = successModal.querySelector('#successAuthorName');
        const titleEl = successModal.querySelector('#successRecipeTitle');
        if (authorEl) authorEl.textContent = author;
        if (titleEl) titleEl.textContent = \`"\${title}"\`;
        openModal(successModal);
      }
    });
  }

  // Quick In-App Toast
  function showToast(message) {
    let toast = document.querySelector('#recipeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'recipeToast';
      toast.style.cssText = \`
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #163E28;
        color: #FFFFFF;
        padding: 12px 24px;
        border-radius: 50px;
        font-size: 0.9rem;
        font-weight: 700;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 1.5px solid #FAA61A;
        z-index: 3000;
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
        text-align: center;
        max-width: 90vw;
      \`;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 4000);
  }

  // Initial runs
  updateBadges();
  renderCommunityGrid();
  renderHomePreview();
}
`;

mainJs = mainJs + '\n' + RECIPE_JS;
fs.writeFileSync('js/main.js', mainJs, 'utf8');
console.log('Appended initRecipeCommunity to js/main.js successfully!');

