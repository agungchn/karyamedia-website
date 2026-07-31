#!/usr/bin/env node

/**
 * Script untuk migrasi articles.ts → 332 file .mdx
 * 
 * Cara pakai: node scripts/migrate-articles.js
 */

const fs = require('fs');
const path = require('path');

const ARTICLES_TS_PATH = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'blog');

// Baca file articles.ts
console.log('📖 Membaca articles.ts...');
const content = fs.readFileSync(ARTICLES_TS_PATH, 'utf-8');

function extractArticles() {
    const articles = [];
    
    // Find all article blocks using regex
    // Each article starts with { slug: and ends before the next { slug: or ] at end
    const articleRegex = /\{\s*slug:\s*"([^"]+)"([\s\S]*?)(?=\{\s*slug:|\]\s*$)/g;
    
    let match;
    while ((match = articleRegex.exec(content)) !== null) {
        const slug = match[1];
        const articleContent = match[2];
        
        const article = {
            slug: slug,
            title: '',
            description: '',
            category: '',
            date: '',
            image: '',
            tags: [],
            canonical: undefined,
            content: ''
        };
        
        // Extract fields
        const titleMatch = articleContent.match(/title:\s*"([^"]+)"/);
        if (titleMatch) article.title = titleMatch[1];
        
        const descMatch = articleContent.match(/description:\s*"([^"]+)"/);
        if (descMatch) article.description = descMatch[1];
        
        const catMatch = articleContent.match(/category:\s*"([^"]+)"/);
        if (catMatch) article.category = catMatch[1];
        
        const dateMatch = articleContent.match(/date:\s*"([^"]+)"/);
        if (dateMatch) article.date = dateMatch[1];
        
        const imageMatch = articleContent.match(/image:\s*"([^"]+)"/);
        if (imageMatch) article.image = imageMatch[1];
        
        const canonicalMatch = articleContent.match(/canonical:\s*"([^"]+)"/);
        if (canonicalMatch) article.canonical = canonicalMatch[1];
        
        const tagsMatch = articleContent.match(/tags:\s*\[([^\]]*)\]/);
        if (tagsMatch) {
            article.tags = tagsMatch[1].split(',').map(t => t.trim().replace(/"/g, ''));
        }
        
        // Extract content - find everything between content: ` and the closing `
        const contentStart = articleContent.indexOf('content:');
        if (contentStart !== -1) {
            const afterContent = articleContent.substring(contentStart);
            
            // Find the opening backtick
            const backtickStart = afterContent.indexOf('`');
            if (backtickStart !== -1) {
                // Check if it's single-line or multi-line
                const afterBacktick = afterContent.substring(backtickStart + 1);
                
                if (afterBacktick.startsWith('\n')) {
                    // Multi-line content - find the closing backtick
                    // The closing backtick is on its own line (possibly with .trim())
                    const lines = afterBacktick.split('\n');
                    const contentLines = [];
                    let foundEnd = false;
                    
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        const trimmedLine = line.trim();
                        
                        // Check if this line is just a backtick or backtick with trim
                        if (trimmedLine === '`' || trimmedLine === '`.trim(),' || trimmedLine === '`,' || trimmedLine === '`.trim()') {
                            foundEnd = true;
                            break;
                        }
                        
                        contentLines.push(line);
                    }
                    
                    if (foundEnd) {
                        // Remove trailing empty lines
                        while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === '') {
                            contentLines.pop();
                        }
                        article.content = contentLines.join('\n');
                    }
                } else {
                    // Single-line content
                    const endBacktick = afterContent.indexOf('`', backtickStart + 1);
                    if (endBacktick !== -1) {
                        article.content = afterContent.substring(backtickStart + 1, endBacktick);
                    }
                }
            }
        }
        
        articles.push(article);
    }
    
    return articles;
}

// Generate frontmatter
function generateFrontmatter(article) {
    let frontmatter = `---
slug: ${article.slug}
title: "${article.title}"
description: "${article.description}"
category: ${article.category}
date: ${article.date}
image: ${article.image}
tags:
`;
    
    for (const tag of article.tags) {
        frontmatter += `  - ${tag}\n`;
    }
    
    if (article.canonical) {
        frontmatter += `canonical: ${article.canonical}\n`;
    }
    
    frontmatter += `---\n`;
    
    return frontmatter;
}

// Sanitize filename
function sanitizeFilename(slug) {
    return slug
        .replace(/[<>:"/\\|?*]/g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

// Main migration
console.log('🔄 Memulai migrasi articles...');

const articles = extractArticles();
console.log(`✅ Ditemukan ${articles.length} artikel`);

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Membuat direktori: ${OUTPUT_DIR}`);
}

// Generate MDX files
let successCount = 0;
let errorCount = 0;
const errors = [];

for (const article of articles) {
    try {
        const filename = sanitizeFilename(article.slug) + '.mdx';
        const filepath = path.join(OUTPUT_DIR, filename);
        
        // Generate MDX content
        const frontmatter = generateFrontmatter(article);
        const mdxContent = `${frontmatter}\n${article.content}\n`;
        
        // Write file
        fs.writeFileSync(filepath, mdxContent, 'utf-8');
        successCount++;
        
        if (successCount % 50 === 0) {
            console.log(`📝 Progress: ${successCount}/${articles.length} artikel`);
        }
    } catch (error) {
        errorCount++;
        errors.push({ slug: article.slug, error: error.message });
        console.error(`❌ Error: ${article.slug} - ${error.message}`);
    }
}

// Summary
console.log('\n========================================');
console.log('📊 RINGKASAN MIGRASI');
console.log('========================================');
console.log(`✅ Berhasil: ${successCount} artikel`);
console.log(`❌ Gagal: ${errorCount} artikel`);
console.log(`📁 Output: ${OUTPUT_DIR}`);

if (errors.length > 0) {
    console.log('\n⚠️  Artikel yang gagal:');
    for (const err of errors) {
        console.log(`   - ${err.slug}: ${err.error}`);
    }
}

console.log('\n✅ Migrasi selesai!');