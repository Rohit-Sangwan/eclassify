const fs = require('fs')
const globby = require('globby')
const addPage = (page) => {
  const path = page
    .replace('src/app/', '')
    .replace('.js', '')
    .replace('.mdx', '')
    .replace('.jsx', '')
    .replace('.ts', '')
    .replace('.tsx', '')
    .replace('page', '')
    .replace('pagee',"")
    .replace('x',"")
    .replace('/x',"")
  // Check if the path is '/index' and replace it with an empty string
  const route = path === '/page' ? '' : path;
  const cleanRoute = route.endsWith('/') ? route.slice(0, -1) : route;
  return `  <url>
    <loc>${`${process.env.NEXT_PUBLIC_WEB_URL}/${cleanRoute}`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>`
}

 const generateSitemap = async () => {
  // excludes Nextjs files and API routes.
  const pages = await globby([
    'src/app/**/*{.js,.jsx,.ts,.tsx,.mdx}',
    '!src/app/_*.js',
    '!src/app/api',
    '!src/app/_*.jsx'
  ])
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(addPage).join('\n')}
  </urlset>`
  fs.writeFileSync('public/sitemap.xml', sitemap)
}
generateSitemap()

