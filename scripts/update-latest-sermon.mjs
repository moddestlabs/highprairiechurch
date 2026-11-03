import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../src/data/latest-video.json');

const CHANNEL_ID = 'UCL66iiIlcIH-PEGDkIOJt4A';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

async function fetchLatestVideo() {
  console.log(`[YouTube] Fetching RSS feed for channel: ${CHANNEL_ID}...`);

  const response = await fetch(FEED_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HPC-Sermon-Updater/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`YouTube RSS feed returned HTTP status ${response.status} ${response.statusText}`);
  }

  const xml = await response.text();

  // Find the first <entry> in the feed
  const entryMatch = xml.match(/<entry>([\s\S]*?)<\/entry>/);
  if (!entryMatch) {
    throw new Error('No <entry> found in YouTube RSS feed.');
  }

  const entry = entryMatch[1];
  const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
  const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
  const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);

  if (!videoIdMatch || !videoIdMatch[1]) {
    throw new Error('Could not extract <yt:videoId> from the latest entry.');
  }

  const videoId = videoIdMatch[1].trim();
  const title = titleMatch ? titleMatch[1].trim() : 'High Prairie Church Sunday Message';
  const publishedAt = publishedMatch ? publishedMatch[1].trim() : new Date().toISOString();

  return { videoId, title, publishedAt };
}

async function main() {
  try {
    let currentData = { videoId: '' };
    if (fs.existsSync(DATA_FILE)) {
      currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    const latest = await fetchLatestVideo();

    console.log(`[YouTube] Current video ID: ${currentData.videoId}`);
    console.log(`[YouTube] Latest video ID from feed: ${latest.videoId} (${latest.title})`);

    if (currentData.videoId === latest.videoId) {
      console.log('[YouTube] Video is already up to date. No changes needed.');
      return;
    }

    const updatedData = {
      videoId: latest.videoId,
      title: latest.title,
      publishedAt: latest.publishedAt,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(updatedData, null, 2) + '\n', 'utf-8');
    console.log(`[YouTube] Successfully updated ${DATA_FILE} with new video ID: ${latest.videoId}`);
  } catch (err) {
    console.error('[YouTube] Error updating latest sermon video:', err);
    // Exit with 0 so a temporary network glitch doesn't fail the scheduled GitHub Action
    process.exit(0);
  }
}

main();

