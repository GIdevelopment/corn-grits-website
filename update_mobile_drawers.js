const fs = require('fs');

const pages = [
  { file: 'index.html', active: 'home' },
  { file: 'what-are-grits.html', active: 'about' },
  { file: 'applications.html', active: 'applications' },
  { file: 'varieties.html', active: 'products' },
  { file: 'manufacturer.html', active: 'manufacturer' },
  { file: 'manufacturers.html', active: 'manufacturer' },
  { file: 'nutrition.html', active: 'nutrition' }
];

function generateDrawer(activeKey) {
  return `  <!-- Mobile Navigation Drawer -->
  <div class="mobile-nav-backdrop"></div>
  <aside class="mobile-nav-drawer" aria-label="Mobile Navigation">
    <div class="mobile-drawer-header">
      <div class="mobile-drawer-brand">
        <strong class="mobile-drawer-logo">Corn Grits</strong>
        <div class="corn-kernel-icon" aria-hidden="true"></div>
      </div>
      <button class="mobile-drawer-close" aria-label="Close navigation menu">&times;</button>
    </div>
    <nav class="mobile-drawer-nav">
      <a href="index.html" class="mobile-nav-link${activeKey === 'home' ? ' is-active' : ''}">
        <span>Home</span>
        ${activeKey === 'home' ? '<span class="nav-active-corn" aria-hidden="true"></span>' : ''}
      </a>
      <a href="what-are-grits.html" class="mobile-nav-link${activeKey === 'about' ? ' is-active' : ''}">
        <span>About Corn Grits</span>
        ${activeKey === 'about' ? '<span class="nav-active-corn" aria-hidden="true"></span>' : ''}
      </a>
      <a href="applications.html" class="mobile-nav-link${activeKey === 'applications' ? ' is-active' : ''}">
        <span>Applications</span>
        ${activeKey === 'applications' ? '<span class="nav-active-corn" aria-hidden="true"></span>' : ''}
      </a>
      <a href="varieties.html" class="mobile-nav-link${activeKey === 'products' ? ' is-active' : ''}">
        <span>Products &amp; Grades</span>
        ${activeKey === 'products' ? '<span class="nav-active-corn" aria-hidden="true"></span>' : ''}
      </a>
      <a href="varieties.html#commercial-grades" class="mobile-sub-link">&bull; Grits 101, 101A, 108, 112</a>
      <a href="manufacturer.html" class="mobile-nav-link${activeKey === 'manufacturer' ? ' is-active' : ''}">
        <span>Manufacturer</span>
        ${activeKey === 'manufacturer' ? '<span class="nav-active-corn" aria-hidden="true"></span>' : ''}
      </a>
      <a href="nutrition.html" class="mobile-nav-link${activeKey === 'nutrition' ? ' is-active' : ''}">
        <span>Nutrition &amp; Storage</span>
        ${activeKey === 'nutrition' ? '<span class="nav-active-corn" aria-hidden="true"></span>' : ''}
      </a>
    </nav>
    <div class="mobile-drawer-footer">
      <button class="btn-contact mobile-drawer-btn" data-open-modal="contact">
        <span>Contact Us &rarr;</span>
      </button>
      <a href="mailto:contact@corngrits.in" class="mobile-drawer-email">
        <span>📧 contact@corngrits.in</span>
      </a>
    </div>
  </aside>`;
}

pages.forEach(({ file, active }) => {
  let content = fs.readFileSync(file, 'utf8');
  // Match old backdrop and drawer
  const pattern = /<!-- Mobile Drawer[\s\S]*?<\/aside>/;
  if (pattern.test(content)) {
    const updated = content.replace(pattern, generateDrawer(active));
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated mobile drawer in ${file}`);
  } else {
    console.error(`Pattern NOT matched in ${file}`);
  }
});

