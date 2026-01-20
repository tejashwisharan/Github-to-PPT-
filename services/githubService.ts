/**
 * Attempts to construct a raw URL from a GitHub repo URL and fetch the README.
 */
export const fetchRepoReadme = async (repoUrl: string): Promise<{ content: string; name: string } | null> => {
  try {
    // 1. Parse URL to get user/repo
    // Expected formats:
    // https://github.com/user/repo
    // https://github.com/user/repo/
    const cleanUrl = repoUrl.replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    
    if (parts.length < 4) return null;
    
    const user = parts[parts.length - 2];
    const repo = parts[parts.length - 1];
    
    // 2. Try fetching from 'main' branch first, then 'master'
    const branches = ['main', 'master'];
    
    for (const branch of branches) {
      const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/README.md`;
      try {
        const response = await fetch(rawUrl);
        if (response.ok) {
          const text = await response.text();
          return { content: text, name: repo };
        }
      } catch (e) {
        console.warn(`Failed to fetch ${branch} branch`, e);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error parsing GitHub URL", error);
    return null;
  }
};