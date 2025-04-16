import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Custom plugin to transform asset URLs for GitHub Pages
function githubPagesAssetPathsPlugin() {
  return {
    name: 'github-pages-asset-paths',
    // During build, this transforms the asset paths in the final output files
    transformIndexHtml(html) {
      // Don't transform during development (when using the dev server)
      if (process.env.NODE_ENV !== 'production') {
        return html;
      }
      
      // Replace asset paths in the HTML file to use relative paths
      return html
        .replace(/src="\/GREEN\//g, 'src="./')
        .replace(/href="\/GREEN\//g, 'href="./')
        .replace(/<script type="module" crossorigin src="\/GREEN\//g, '<script type="module" crossorigin src="./');
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    githubPagesAssetPathsPlugin()
  ],
  base: '/GREEN/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
