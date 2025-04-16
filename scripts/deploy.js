// Manual GitHub Pages deployment script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: The dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

try {
  // Save the current branch name
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  console.log(`📋 Current branch: ${currentBranch}`);

  // Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('✅ Created .nojekyll file');

  // Ensure CNAME file exists in the dist directory
  if (!fs.existsSync(path.join(distDir, 'CNAME'))) {
    fs.copyFileSync(path.join(rootDir, 'public', 'CNAME'), path.join(distDir, 'CNAME'));
    console.log('✅ Copied CNAME file to dist directory');
  }

  // Initialize git in the dist directory
  console.log('🚀 Starting deployment process...');
  
  // Navigate to the dist directory
  process.chdir(distDir);
  
  // Initialize a new git repository in the dist directory
  execSync('git init');
  console.log('✅ Initialized git repository in dist directory');
  
  // Add all files to git
  execSync('git add -A');
  console.log('✅ Added all files to git');
  
  // Commit the changes
  execSync('git commit -m "Deploy to GitHub Pages"');
  console.log('✅ Committed changes');
  
  // Push to the gh-pages branch on GitHub
  console.log('🔄 Pushing to gh-pages branch...');
  execSync('git push -f https://github.com/RorriMaesu/GREEN.git master:gh-pages');
  console.log('✅ Successfully pushed to gh-pages branch');
  
  // Return to the original directory
  process.chdir(rootDir);
  
  console.log('✨ Deployment complete! Your site should be available shortly at https://rorrimaesu.github.io/GREEN/');
} catch (error) {
  console.error('❌ Deployment error:', error.message);
  process.exit(1);
}

