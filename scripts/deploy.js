// Manual GitHub Pages deployment script with enhanced debugging
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Debug information
console.log('===== DEBUG INFORMATION =====');
console.log(`Root directory: ${rootDir}`);
console.log(`Dist directory: ${distDir}`);
console.log('Current directory structure:');
try {
  execSync('dir', { stdio: 'inherit' });
} catch (error) {
  console.error('Error listing directory:', error.message);
}

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ Error: The dist directory does not exist. Running build now...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

try {
  // Save the current branch name
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  console.log(`📋 Current branch: ${currentBranch}`);

  // Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
  console.log('✅ Created .nojekyll file');

  // Debug: List the contents of the dist directory
  console.log('Dist directory contents:');
  execSync(`dir "${distDir}"`, { stdio: 'inherit' });

  // Ensure 404.html exists in the dist directory
  if (fs.existsSync(path.join(rootDir, 'public', '404.html'))) {
    fs.copyFileSync(path.join(rootDir, 'public', '404.html'), path.join(distDir, '404.html'));
    console.log('✅ Copied 404.html file to dist directory');
  } else {
    console.warn('⚠️ Warning: 404.html not found in public directory');
  }

  // Ensure CNAME file exists in the dist directory
  if (fs.existsSync(path.join(rootDir, 'public', 'CNAME'))) {
    fs.copyFileSync(path.join(rootDir, 'public', 'CNAME'), path.join(distDir, 'CNAME'));
    console.log('✅ Copied CNAME file to dist directory');
  } else {
    console.warn('⚠️ Warning: CNAME file not found in public directory');
  }

  // Check if _redirects file exists and copy it to dist
  if (fs.existsSync(path.join(rootDir, 'public', '_redirects'))) {
    fs.copyFileSync(path.join(rootDir, 'public', '_redirects'), path.join(distDir, '_redirects'));
    console.log('✅ Copied _redirects file to dist directory');
  } else {
    console.warn('⚠️ Warning: _redirects file not found in public directory');
  }

  // Initialize git in the dist directory
  console.log('🚀 Starting deployment process...');
  
  // Navigate to the dist directory
  process.chdir(distDir);
  console.log(`Changed working directory to: ${process.cwd()}`);
  
  // Initialize a new git repository in the dist directory
  execSync('git init', { stdio: 'inherit' });
  console.log('✅ Initialized git repository in dist directory');
  
  // Configure git user to avoid errors
  execSync('git config user.name "GitHub Actions"', { stdio: 'inherit' });
  execSync('git config user.email "actions@github.com"', { stdio: 'inherit' });
  
  // Add all files to git
  execSync('git add -A', { stdio: 'inherit' });
  console.log('✅ Added all files to git');
  
  // Commit the changes
  execSync('git commit -m "Deploy to GitHub Pages"', { stdio: 'inherit' });
  console.log('✅ Committed changes');
  
  // Push to the gh-pages branch on GitHub
  console.log('🔄 Pushing to gh-pages branch...');
  // Using origin to push to gh-pages
  try {
    execSync('git push -f origin HEAD:gh-pages', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to gh-pages branch using origin');
  } catch (error) {
    console.log('⚠️ Failed to push using origin, trying with full URL...');
    execSync('git push -f https://github.com/RorriMaesu/GREEN.git HEAD:gh-pages', { stdio: 'inherit' });
    console.log('✅ Successfully pushed to gh-pages branch using full URL');
  }
  
  // Return to the original directory
  process.chdir(rootDir);
  console.log(`Changed working directory back to: ${process.cwd()}`);
  
  console.log('✨ Deployment complete! Your site should be available shortly at https://rorrimaesu.github.io/GREEN/');
  console.log('🔧 Important: Make sure GitHub Pages is configured to deploy from the gh-pages branch in your repository settings.');
} catch (error) {
  console.error('❌ Deployment error:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}

