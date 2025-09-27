/**
 * GitHub Profile Analyzer for TruHire
 * Analyzes GitHub profiles to provide interview context
 */

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Extract username from GitHub URL
 */
function extractUsernameFromUrl(githubUrl) {
    try {
        const url = githubUrl.trim();
        
        // If it's already just a username
        if (!url.includes('/') && !url.includes('.')) {
            return url;
        }
        
        // Handle full URLs
        const patterns = [
            /github\.com\/([^\/\?#]+)/i,  // https://github.com/username
            /^([^\/\?#]+)$/,              // Just username
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        throw new Error('Could not extract username from URL');
    } catch (error) {
        console.error('Error extracting username from URL:', error);
        throw new Error(`Invalid GitHub URL format: ${githubUrl}`);
    }
}

/**
 * Fetch data from GitHub API with error handling
 */
async function fetchGitHubApi(endpoint, username) {
    try {
        const url = `${GITHUB_API_BASE}${endpoint}`;
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'TruHire-GitHub-Analyzer'
        };
        
        console.log(`Fetching: ${url}`);
        
        const response = await fetch(url, { headers });
        
        if (!response.ok) {
            if (response.status === 404) {
                if (endpoint.includes('/users/')) {
                    throw new Error(`GitHub user '${username || 'unknown'}' not found`);
                } else {
                    throw new Error(`Resource not found: ${endpoint}`);
                }
            } else if (response.status === 403) {
                throw new Error(`GitHub API rate limit exceeded or access denied`);
            } else {
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Get basic user information from GitHub API
 */
async function getGitHubUserInfo(username) {
    try {
        const userData = await fetchGitHubApi(`/users/${username}`, username);
        
        return {
            username: userData.login,
            name: userData.name || '',
            bio: userData.bio || '',
            location: userData.location || '',
            email: userData.email || '',
            blog: userData.blog || '',
            company: userData.company || '',
            profileUrl: userData.html_url,
            avatarUrl: userData.avatar_url,
            followers: userData.followers || 0,
            following: userData.following || 0,
            publicRepos: userData.public_repos || 0,
            publicGists: userData.public_gists || 0,
            accountCreationDate: userData.created_at,
            lastActivityDate: userData.updated_at,
        };
    } catch (error) {
        console.error('Error getting GitHub user info:', error);
        throw new Error(`Failed to get user info: ${error.message}`);
    }
}

/**
 * Get user's repositories from GitHub API
 */
async function getGitHubUserRepositories(username, maxRepos = 10) {
    try {
        const repositories = [];
        let page = 1;
        const perPage = Math.min(maxRepos, 100);
        
        while (repositories.length < maxRepos) {
            const repoData = await fetchGitHubApi(
                `/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`,
                username
            );
            
            if (!repoData || repoData.length === 0) {
                break;
            }
            
            for (const repo of repoData) {
                if (repositories.length >= maxRepos) break;
                
                repositories.push({
                    name: repo.name,
                    fullName: repo.full_name,
                    description: repo.description || '',
                    language: repo.language || '',
                    stars: repo.stargazers_count || 0,
                    forks: repo.forks_count || 0,
                    watchers: repo.watchers_count || 0,
                    size: repo.size || 0,
                    isPrivate: repo.private || false,
                    isFork: repo.fork || false,
                    createdAt: repo.created_at,
                    updatedAt: repo.updated_at,
                    topics: repo.topics || [],
                    url: repo.html_url,
                    license: repo.license?.name || '',
                    hasIssues: repo.has_issues || false,
                    openIssues: repo.open_issues_count || 0,
                    defaultBranch: repo.default_branch || 'main',
                });
            }
            
            page++;
        }
        
        return repositories;
    } catch (error) {
        console.error('Error getting GitHub repositories:', error);
        throw new Error(`Failed to get repositories: ${error.message}`);
    }
}

/**
 * Calculate language statistics from repositories
 */
function calculateLanguageStats(repositories) {
    try {
        const languageCount = {};
        let totalRepos = 0;
        
        for (const repo of repositories) {
            if (repo.language && !repo.isFork) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
                totalRepos++;
            }
        }
        
        const languageStats = Object.entries(languageCount)
            .map(([language, count]) => ({
                language,
                count,
                percentage: totalRepos > 0 ? (count / totalRepos) * 100 : 0,
            }))
            .sort((a, b) => b.percentage - a.percentage);
        
        return languageStats;
    } catch (error) {
        console.error('Error calculating language statistics:', error);
        return [];
    }
}

/**
 * Get user's recent activity for contribution analysis
 */
async function getGitHubUserEvents(username, maxEvents = 30) {
    try {
        const events = [];
        let page = 1;
        const perPage = Math.min(maxEvents, 30);
        
        const eventData = await fetchGitHubApi(
            `/users/${username}/events?page=${page}&per_page=${perPage}`,
            username
        );
        
        if (eventData && eventData.length > 0) {
            events.push(...eventData);
        }
        
        return events.slice(0, maxEvents);
    } catch (error) {
        console.warn('Error fetching user events:', error);
        return [];
    }
}

/**
 * Analyze commit patterns and activity
 */
function analyzeActivity(events, repositories) {
    try {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Filter push events (commits)
        const pushEvents = events.filter(event => event.type === 'PushEvent');
        
        const recentCommits = pushEvents.filter(event =>
            new Date(event.created_at) > oneWeekAgo
        ).reduce((sum, event) => sum + (event.payload?.commits?.length || 0), 0);
        
        const monthlyCommits = pushEvents.filter(event =>
            new Date(event.created_at) > oneMonthAgo
        ).reduce((sum, event) => sum + (event.payload?.commits?.length || 0), 0);
        
        // Analyze repository activity
        const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
        const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
        const activeRepos = repositories.filter(repo => 
            new Date(repo.updatedAt) > oneMonthAgo
        ).length;
        
        return {
            recentCommits,
            monthlyCommits,
            totalStars,
            totalForks,
            activeRepos,
            totalRepos: repositories.length,
            originalRepos: repositories.filter(repo => !repo.isFork).length,
        };
    } catch (error) {
        console.error('Error analyzing activity:', error);
        return {
            recentCommits: 0,
            monthlyCommits: 0,
            totalStars: 0,
            totalForks: 0,
            activeRepos: 0,
            totalRepos: 0,
            originalRepos: 0,
        };
    }
}

/**
 * Generate interview insights from GitHub data
 */
function generateInterviewInsights(userInfo, repositories, languageStats, activity) {
    const insights = [];
    
    // Experience level assessment
    const accountAge = Math.floor((Date.now() - new Date(userInfo.accountCreationDate).getTime()) / (1000 * 60 * 60 * 24 * 365));
    if (accountAge >= 3) {
        insights.push(`Experienced developer with ${accountAge} years on GitHub`);
    } else if (accountAge >= 1) {
        insights.push(`Mid-level developer with ${accountAge} year(s) on GitHub`);
    } else {
        insights.push(`Junior developer, relatively new to GitHub (${accountAge < 1 ? 'less than 1 year' : accountAge + ' year'})`);
    }
    
    // Language expertise
    if (languageStats.length > 0) {
        const primaryLang = languageStats[0];
        if (primaryLang.percentage > 50) {
            insights.push(`Specializes in ${primaryLang.language} (${primaryLang.percentage.toFixed(1)}% of repositories)`);
        } else {
            const topLangs = languageStats.slice(0, 3).map(l => l.language).join(', ');
            insights.push(`Multi-language developer: ${topLangs}`);
        }
    }
    
    // Activity patterns
    if (activity.recentCommits > 10) {
        insights.push(`Very active developer (${activity.recentCommits} commits this week)`);
    } else if (activity.recentCommits > 3) {
        insights.push(`Moderately active developer (${activity.recentCommits} commits this week)`);
    } else if (activity.monthlyCommits > 0) {
        insights.push(`Less frequent contributor (${activity.monthlyCommits} commits this month)`);
    } else {
        insights.push(`Low recent activity - may be working on private projects or taking a break`);
    }
    
    // Project quality indicators
    if (activity.totalStars > 100) {
        insights.push(`Creates popular projects (${activity.totalStars} total stars)`);
    } else if (activity.totalStars > 10) {
        insights.push(`Has some recognition in the community (${activity.totalStars} stars)`);
    }
    
    // Collaboration indicators
    if (activity.totalForks > 50) {
        insights.push(`Projects are actively forked by others (${activity.totalForks} total forks)`);
    }
    
    // Portfolio diversity
    const originalRepoRatio = activity.originalRepos / activity.totalRepos;
    if (originalRepoRatio > 0.7) {
        insights.push(`Primarily creates original projects (${Math.round(originalRepoRatio * 100)}% original repos)`);
    } else if (originalRepoRatio < 0.3) {
        insights.push(`Contributes more to existing projects (${Math.round(originalRepoRatio * 100)}% original repos)`);
    } else {
        insights.push(`Balanced between creating and contributing to projects`);
    }
    
    return insights;
}

/**
 * Generate technical questions based on GitHub analysis
 */
function generateTechnicalQuestions(repositories, languageStats) {
    const questions = [];
    
    // Language-specific questions
    if (languageStats.length > 0) {
        const primaryLang = languageStats[0].language;
        questions.push(`I see you primarily work with ${primaryLang}. Can you walk me through your experience with this language?`);
        
        if (languageStats.length > 1) {
            const secondaryLang = languageStats[1].language;
            questions.push(`You also have experience with ${secondaryLang}. How do you decide which language to use for different projects?`);
        }
    }
    
    // Project-specific questions
    const interestingRepos = repositories
        .filter(repo => !repo.isFork && (repo.stars > 0 || repo.description))
        .slice(0, 3);
    
    interestingRepos.forEach(repo => {
        if (repo.description) {
            questions.push(`Tell me about your "${repo.name}" project. What challenges did you face while building it?`);
        }
    });
    
    // Architecture questions
    const hasWebProjects = repositories.some(repo => 
        repo.language === 'JavaScript' || repo.language === 'TypeScript' || 
        repo.topics.some(topic => ['web', 'frontend', 'backend', 'fullstack'].includes(topic.toLowerCase()))
    );
    
    if (hasWebProjects) {
        questions.push(`I notice you have web development projects. How do you approach scalability and performance optimization?`);
    }
    
    return questions;
}

/**
 * Main function to analyze GitHub profile
 */
async function analyzeGitHubProfile(githubUrl) {
    try {
        console.log('Starting GitHub profile analysis for:', githubUrl);
        
        const username = extractUsernameFromUrl(githubUrl);
        console.log('Analyzing profile for username:', username);
        
        // Get user info and repositories in parallel
        const [userInfo, repositories] = await Promise.all([
            getGitHubUserInfo(username),
            getGitHubUserRepositories(username, 15)
        ]);
        
        // Get recent activity
        const events = await getGitHubUserEvents(username);
        
        // Analyze data
        const languageStats = calculateLanguageStats(repositories);
        const activity = analyzeActivity(events, repositories);
        const insights = generateInterviewInsights(userInfo, repositories, languageStats, activity);
        const questions = generateTechnicalQuestions(repositories, languageStats);
        
        const analysis = {
            userInfo,
            repositories: repositories.slice(0, 10), // Limit for display
            languageStats,
            activity,
            insights,
            questions,
            analyzedAt: new Date().toISOString(),
        };
        
        console.log('GitHub analysis completed successfully');
        return analysis;
        
    } catch (error) {
        console.error('Error analyzing GitHub profile:', error);
        throw error;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        analyzeGitHubProfile,
        extractUsernameFromUrl
    };
}

// Export for browser environment
if (typeof window !== 'undefined') {
    window.GitHubAnalyzer = {
        analyzeGitHubProfile,
        extractUsernameFromUrl
    };
}
