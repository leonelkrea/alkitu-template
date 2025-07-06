import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import { logger } from './logger';

export async function getMarkdownContent(fileName: string) {
  if (!fileName) {
    return '<p>Please select a document to view.</p>';
  }
  const filePath = path.join(process.cwd(), 'docs', fileName);
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const processedContent = await remark().use(html).process(fileContents);
    return processedContent.toString();
  } catch (error) {
    logger.error(`Error reading file ${fileName}:`, { error });
    return '<p>Error loading documentation. Please try again later.</p>';
  }
}

export async function getDocsFiles() {
  const docsDirectory = path.join(process.cwd(), 'docs');
  try {
    return fs.readdirSync(docsDirectory).filter((file) => file.endsWith('.md'));
  } catch (error) {
    logger.error('Error reading docs directory:', { error });
    return [];
  }
}
