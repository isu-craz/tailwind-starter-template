#!/usr/bin/env node

/**
 * Setup Script for Tailwind Starter Template
 * Helps customize the template for your project
 */

import { readFileSync, writeFileSync } from 'fs'
import { createInterface } from 'readline'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

// Helper function to ask questions
const question = (query) => new Promise((resolve) => rl.question(query, resolve))

console.log('🚀 Welcome to Tailwind Starter Template Setup!\n')
console.log('This script will help you customize the template for your project.\n')

async function setup() {
  try {
    // Get project information
    const projectName = await question('📝 Project name: ')
    const projectDescription = await question('📋 Project description: ')
    const authorName = await question('👤 Author name: ')
    const authorEmail = await question('📧 Author email (optional): ')
    const githubRepo = await question('🔗 GitHub repository URL (optional): ')
    
    console.log('\n⚙️  Updating project files...\n')

    // Update package.json
    updatePackageJson({
      name: projectName || 'my-tailwind-project',
      description: projectDescription || 'A project built with Tailwind Starter Template',
      author: authorEmail ? `${authorName} <${authorEmail}>` : authorName || 'Your Name'
    })

    // Update HTML files
    updateHtmlFiles({
      title: projectName || 'My Project',
      description: projectDescription || 'A project built with Tailwind Starter Template'
    })

    // Update README
    updateReadme({
      projectName: projectName || 'My Project',
      description: projectDescription || 'A project built with Tailwind Starter Template',
      author: authorName || 'Your Name',
      email: authorEmail || 'your-email@example.com',
      repo: githubRepo || 'https://github.com/your-username/your-repo'
    })

    console.log('✅ Project customization complete!\n')
    console.log('🎉 Your template is now ready to use. Run "npm run dev" to start developing!\n')
    
    const shouldInstall = await question('📦 Install dependencies now? (y/n): ')
    
    if (shouldInstall.toLowerCase() === 'y' || shouldInstall.toLowerCase() === 'yes') {
      console.log('\n📦 Installing dependencies...\n')
      const { spawn } = await import('child_process')
      
      const install = spawn('npm', ['install'], {
        stdio: 'inherit',
        cwd: rootDir
      })
      
      install.on('close', (code) => {
        if (code === 0) {
          console.log('\n✅ Dependencies installed successfully!')
          console.log('\n🚀 Run "npm run dev" to start your development server!')
        } else {
          console.log('\n❌ Error installing dependencies. Please run "npm install" manually.')
        }
        rl.close()
      })
    } else {
      console.log('\n💡 Remember to run "npm install" to install dependencies.')
      rl.close()
    }
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message)
    rl.close()
  }
}

function updatePackageJson(info) {
  try {
    const packageJsonPath = join(rootDir, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    
    packageJson.name = slugify(info.name)
    packageJson.description = info.description
    packageJson.author = info.author
    
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log('✅ Updated package.json')
  } catch (error) {
    console.log('⚠️  Could not update package.json:', error.message)
  }
}

function updateHtmlFiles(info) {
  try {
    const indexPath = join(rootDir, 'index.html')
    let indexHtml = readFileSync(indexPath, 'utf8')
    
    // Update title and description
    indexHtml = indexHtml.replace(/<title>.*<\/title>/, `<title>${info.title}</title>`)
    indexHtml = indexHtml.replace(/content=".*"/, `content="${info.description}"`)
    
    // Update main heading
    indexHtml = indexHtml.replace(
      /Tailwind Starter Template/g,
      info.title
    )
    
    writeFileSync(indexPath, indexHtml)
    console.log('✅ Updated index.html')
  } catch (error) {
    console.log('⚠️  Could not update HTML files:', error.message)
  }
}

function updateReadme(info) {
  try {
    const readmePath = join(rootDir, 'README.md')
    let readme = readFileSync(readmePath, 'utf8')
    
    // Update project name in title
    readme = readme.replace(/# 🚀 Tailwind Starter Template/, `# 🚀 ${info.projectName}`)
    
    // Update description
    readme = readme.replace(
      /> A comprehensive, professional-grade starter template.*$/m,
      `> ${info.description}`
    )
    
    // Update clone command
    readme = readme.replace(
      /git clone <your-repo-url> my-project/,
      `git clone ${info.repo} ${slugify(info.projectName)}`
    )
    
    // Update contact information
    readme = readme.replace(/your-email@example.com/, info.email)
    readme = readme.replace(/your-username\/your-repo/g, getRepoPath(info.repo))
    
    writeFileSync(readmePath, readme)
    console.log('✅ Updated README.md')
  } catch (error) {
    console.log('⚠️  Could not update README.md:', error.message)
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function getRepoPath(url) {
  try {
    const match = url.match(/github\.com[\/:](.+?)(?:\.git)?$/)
    return match ? match[1] : 'your-username/your-repo'
  } catch {
    return 'your-username/your-repo'
  }
}

// Start setup
setup()
