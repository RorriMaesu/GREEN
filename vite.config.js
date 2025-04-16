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
      
      // Replace asset paths in the HTML file
      return html
        .replace(/src="\//g, 'src="/')
        .replace(/href="\//g, 'href="/')
        .replace(/<script type="module" crossorigin src="\//g, '<script type="module" crossorigin src="./');
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
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
