import { Event, EventRSVP, Project, CreativeWork, ClubStats, LeaderboardResponse } from '../types';
import GITOPS_PROJECTS from '../data/projects.json';
import GITOPS_CREATIVES from '../data/creatives.json';
import GITOPS_LEADERBOARD from '../data/leaderboard.json';
import GITOPS_EVENTS from '../data/events.json';

const FALLBACK_EVENTS: Event[] = (GITOPS_EVENTS as unknown as Event[]) || [];
const FALLBACK_CREATIVES: CreativeWork[] = (GITOPS_CREATIVES as unknown as CreativeWork[]) || [];

export const api = {
  // --- Events APIs (Pure GitOps) ---
  async getEvents(): Promise<Event[]> {
    return (GITOPS_EVENTS as unknown as Event[]) || FALLBACK_EVENTS;
  },

  async syncTinkerhubEvents(): Promise<Event[]> {
    return (GITOPS_EVENTS as unknown as Event[]) || FALLBACK_EVENTS;
  },

  async rsvpEvent(_eventId: string, rsvpData: EventRSVP): Promise<{ success: boolean; message: string }> {
    try {
      const existing = JSON.parse(localStorage.getItem('foss_campus_rsvps') || '[]');
      existing.push({ ...rsvpData, timestamp: new Date().toISOString() });
      localStorage.setItem('foss_campus_rsvps', JSON.stringify(existing));
    } catch {
      // Ignored
    }
    return {
      success: true,
      message: `RSVP confirmed for ${rsvpData.name}! See you at the workshop.`
    };
  },

  // --- Projects APIs (Pure GitOps with Client GitHub Sync) ---
  async getProjects(tech?: string, forceSync?: boolean): Promise<Project[]> {
    const gitopsList = (GITOPS_PROJECTS as unknown as Project[]) || [];
    let baseList: Project[] = gitopsList;
    
    const cached = localStorage.getItem('foss_projects_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= gitopsList.length) {
          baseList = parsed;
        }
      } catch {
        baseList = gitopsList;
      }
    }

    if (forceSync) {
      baseList = await Promise.all(
        baseList.map(async (p) => {
          try {
            const match = p.repo_url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (match) {
              const owner = match[1];
              const repo = match[2].replace(/\.git$/, '');
              const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
              if (ghRes.ok) {
                const ghData = await ghRes.json();
                
                let actualIssues = ghData.open_issues_count ?? p.open_issues;
                if (actualIssues > 0) {
                  try {
                    const pullsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=1`);
                    if (pullsRes.ok) {
                      const pullsData = await pullsRes.json();
                      if (Array.isArray(pullsData) && pullsData.length > 0) {
                        const linkHeader = pullsRes.headers.get('Link');
                        if (linkHeader) {
                          const lastMatch = linkHeader.match(/<[^>]+[?&]page=(\d+)[^>]*>;\s*rel="last"/);
                          if (lastMatch) {
                            actualIssues = Math.max(0, actualIssues - parseInt(lastMatch[1], 10));
                          } else {
                            actualIssues = Math.max(0, actualIssues - 1);
                          }
                        } else {
                          actualIssues = Math.max(0, actualIssues - 1);
                        }
                      }
                    }
                  } catch {
                    // Ignore pulls fetch error
                  }
                }

                return {
                  ...p,
                  stars: ghData.stargazers_count ?? p.stars,
                  forks: ghData.forks_count ?? p.forks,
                  open_issues: actualIssues,
                  description: ghData.description || p.description
                };
              }
            }
          } catch (err) {
            console.warn(`[Client GitHub Sync] Notice for ${p.repo_url}:`, err);
          }
          return p;
        })
      );
      localStorage.setItem('foss_projects_cache', JSON.stringify(baseList));
    }

    return tech && tech !== 'all'
      ? baseList.filter(p => p.tech_stack.some(t => t.toLowerCase() === tech.toLowerCase()))
      : baseList;
  },

  async syncProjects(): Promise<{ success: boolean; message: string; projects: Project[] }> {
    const updated = await this.getProjects(undefined, true);
    return {
      success: true,
      message: `Synchronized ${updated.length} repositories directly from GitHub.`,
      projects: updated
    };
  },

  // --- Creative Showcase APIs (Pure GitOps) ---
  async getCreatives(category?: string): Promise<CreativeWork[]> {
    const list = (GITOPS_CREATIVES as unknown as CreativeWork[]) || FALLBACK_CREATIVES;
    if (!category || category === 'all') {
      return list;
    }
    return list.filter(c => c.category?.toLowerCase() === category.toLowerCase());
  },

  // --- Stats APIs (Dynamically Computed from Datasets) ---
  async getStats(): Promise<ClubStats> {
    const projCount = (GITOPS_PROJECTS as unknown as Project[])?.length || 0;
    const creativeCount = (GITOPS_CREATIVES as unknown as CreativeWork[])?.length || 0;
    const contribCount = (GITOPS_LEADERBOARD as any)?.contributors?.length || 0;
    const eventCount = (GITOPS_EVENTS as unknown as Event[])?.length || 0;

    return {
      active_members: Math.max(1, contribCount),
      projects_built: Math.max(1, projCount),
      creative_works: creativeCount,
      workshops_hosted: Math.max(1, eventCount),
      open_pull_requests: 0,
      lines_of_foss_code: 'Genesis'
    };
  },

  // --- Leaderboard & XP APIs (Pure GitOps) ---
  async getLeaderboard(timeframe: 'all_time' | 'monthly' = 'all_time'): Promise<LeaderboardResponse> {
    if (GITOPS_LEADERBOARD && (GITOPS_LEADERBOARD as any).contributors) {
      return {
        ...(GITOPS_LEADERBOARD as any),
        timeframe
      } as LeaderboardResponse;
    }

    return {
      status: 'success',
      timeframe,
      total_contributors: 0,
      contributors: []
    };
  }
};
