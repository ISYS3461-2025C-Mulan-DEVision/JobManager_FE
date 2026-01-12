import axios from "axios";
import { JA_USER_SERVICE_URL, JA_AUTH_TOKEN, SKILLS_ENDPOINT } from "@/utils/constants";
import { Skill } from "@/types/skill";

/**
 * Response format from JA Skills API
 */
interface SkillsApiResponse {
    success: boolean;
    message: string;
    data: Skill[];
    timestamp: string;
}

/**
 * Skills Service - Direct communication with JA User Service
 * Fetches all skills once, client-side filtering
 */
class SkillService {
    private skillsCache: Skill[] | null = null;
    private cacheTimestamp: number = 0;
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    /**
     * Get authorization headers for JA API
     */
    private getHeaders() {
        return {
            "Authorization": `Bearer ${JA_AUTH_TOKEN}`,
            "Content-Type": "application/json",
        };
    }

    /**
     * Get all available skills (with caching)
     */
    async getAllSkills(): Promise<Skill[]> {
        const now = Date.now();
        
        // Return cached data if still valid
        if (this.skillsCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
            console.log('Returning cached skills:', this.skillsCache.length);
            return this.skillsCache;
        }

        try {
            const response = await axios.get<SkillsApiResponse>(
                `${JA_USER_SERVICE_URL}${SKILLS_ENDPOINT}`,
                {
                    headers: this.getHeaders(),
                }
            );
            
            // Extract skills from the data field
            const skills = response.data.data;
            
            if (!Array.isArray(skills)) {
                console.error('Expected skills array, got:', typeof skills);
                throw new Error('Invalid skills data format');
            }
            
            console.log(`Fetched ${skills.length} skills from JA API`);
            
            // Update cache
            this.skillsCache = skills;
            this.cacheTimestamp = now;
            
            return skills;
        } catch (error) {
            console.error("Failed to fetch skills:", error);
            
            // Log more details about the error
            if (axios.isAxiosError(error)) {
                console.error('Response status:', error.response?.status);
                console.error('Response data:', error.response?.data);
            }
            
            // Return cached data if available, even if stale
            if (this.skillsCache) {
                console.warn("Using stale skills cache due to fetch error");
                return this.skillsCache;
            }
            throw error;
        }
    }

    /**
     * Clear the cache (useful for force refresh)
     */
    clearCache(): void {
        this.skillsCache = null;
        this.cacheTimestamp = 0;
    }
}

export const skillService = new SkillService();