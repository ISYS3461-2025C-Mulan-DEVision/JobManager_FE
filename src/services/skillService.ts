import axios from "axios";
import { JA_USER_SERVICE_URL, SKILLS_ENDPOINT } from "@/utils/constants";
import { Skill } from "@/types/skill";

/**
 * Skills Service - Direct communication with JA User Service
 * Fetches all skills once, client-side filtering
 */
class SkillService {
    private skillsCache: Skill[] | null = null;
    private cacheTimestamp: number = 0;
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    /**
     * Get all available skills (with caching)
     */
    async getAllSkills(): Promise<Skill[]> {
        const now = Date.now();
        
        // Return cached data if still valid
        if (this.skillsCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
            return this.skillsCache;
        }

        try {
            const response = await axios.get<Skill[]>(
                `${JA_USER_SERVICE_URL}${SKILLS_ENDPOINT}`
            );
            
            // Update cache
            this.skillsCache = response.data;
            this.cacheTimestamp = now;
            
            return response.data;
        } catch (error) {
            console.error("Failed to fetch skills:", error);
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