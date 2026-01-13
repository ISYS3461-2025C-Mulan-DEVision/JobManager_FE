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
 * ngrok bypass headers to prevent HTML interstitial page
 */
const NGROK_BYPASS_HEADERS = {
	"ngrok-skip-browser-warning": "69420", // Any value works to bypass ngrok warning
	"User-Agent": "DEVisionJobManager/1.0",
};

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
	 * CRITICAL: Includes ngrok bypass headers to prevent receiving HTML page
	 */
	private getHeaders() {
		return {
			"Authorization": `Bearer ${JA_AUTH_TOKEN}`,
			"Content-Type": "application/json",
			...NGROK_BYPASS_HEADERS, // Bypass ngrok HTML interstitial page
		};
	}

	async getAllSkills(): Promise<Skill[]> {
		const now = Date.now();

		// Return cached data if still valid
		if (this.skillsCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
			console.log('✓ Returning cached skills:', this.skillsCache.length);
			return this.skillsCache;
		}

		try {
			const fullUrl = `${JA_USER_SERVICE_URL}${SKILLS_ENDPOINT}`;
			console.log('🔍 Fetching skills from:', fullUrl);

			const response = await axios.get(fullUrl, {
				headers: this.getHeaders(),
			});

			// Check if we received HTML instead of JSON (ngrok issue)
			if (typeof response.data === 'string' && response.data.includes('ngrok')) {
				console.error('❌ RECEIVED NGROK HTML PAGE - Headers may not be working correctly');
				console.error('Response preview:', response.data.substring(0, 200));
				throw new Error('Received HTML from ngrok instead of JSON. Check bypass headers.');
			}

			console.log('✓ Response status:', response.status);
			console.log('✓ Response type:', typeof response.data);

			// Parse the response
			let skills: Skill[] | undefined;

			// Expected structure: { success: true, message: "...", data: [...], timestamp: "..." }
			if (response.data?.data && Array.isArray(response.data.data)) {
				console.log('✓ Using response.data.data (expected structure)');
				skills = response.data.data;
			}
			// Fallback: data is directly an array
			else if (Array.isArray(response.data)) {
				console.log('✓ Using response.data directly (direct array)');
				skills = response.data;
			}
			// Fallback: response.data.skills
			else if (response.data.skills && Array.isArray(response.data.skills)) {
				console.log('✓ Using response.data.skills');
				skills = response.data.skills;
			}
			else {
				console.error('❌ Unexpected response structure:', response.data);
				console.error('Response keys:', Object.keys(response.data || {}));
				throw new Error('Invalid skills data format from API');
			}

			if (!skills || !Array.isArray(skills) || skills.length === 0) {
				console.warn('⚠️ No skills found in response');
				skills = []; // Return empty array instead of throwing
			}

			console.log(`✓ Successfully fetched ${skills.length} skills from JA API`);

			// Update cache
			this.skillsCache = skills;
			this.cacheTimestamp = now;

			return skills;

		} catch (error) {
			console.error("❌ Failed to fetch skills:", error);

			// Log detailed error information
			if (axios.isAxiosError(error)) {
				console.error('Response status:', error.response?.status);
				console.error('Response data type:', typeof error.response?.data);
				console.error('Request URL:', error.config?.url);
				
				// Check if we got HTML instead of JSON
				if (typeof error.response?.data === 'string') {
					const preview = error.response.data.substring(0, 200);
					console.error('Response preview:', preview);
					
					if (error.response.data.includes('ngrok')) {
						console.error('⚠️ This is an ngrok HTML page - bypass headers not working!');
					}
				}
			}

			// Return cached data if available, even if stale
			if (this.skillsCache) {
				console.warn("⚠️ Using stale skills cache due to fetch error");
				return this.skillsCache;
			}

			// Return empty array as last resort to prevent app crash
			console.warn("⚠️ Returning empty skills array as fallback");
			return [];
		}
	}

	/**
	 * Fetch skills by their IDs
	 * Uses getAllSkills() cache for efficiency
	 * @param skillIds Array of skill UUIDs
	 * @returns Array of Skill objects
	 */
	async getSkillsByIds(skillIds: string[]): Promise<Skill[]> {
		if (!skillIds || skillIds.length === 0) {
			return [];
		}

		try {
			// Fetch all skills (uses cache if available)
			const allSkills = await this.getAllSkills();

			// Filter to only the requested IDs
			const requestedSkills = allSkills.filter(skill =>
				skillIds.includes(skill.id)
			);

			// Log if some skills weren't found
			if (requestedSkills.length !== skillIds.length) {
				const foundIds = requestedSkills.map(s => s.id);
				const missingIds = skillIds.filter(id => !foundIds.includes(id));
				console.warn(`⚠️ Could not find ${missingIds.length} skills:`, missingIds);

				// Create placeholder skills for missing IDs
				const placeholderSkills = missingIds.map(id => ({
					id,
					name: `Unknown Skill (${id.substring(0, 8)}...)`,
					usageCount: 0,
				}));

				return [...requestedSkills, ...placeholderSkills];
			}

			console.log(`✓ Found ${requestedSkills.length} skills by IDs`);
			return requestedSkills;

		} catch (error) {
			console.error("❌ Failed to fetch skills by IDs:", error);

			// Return placeholder skills on error
			return skillIds.map(id => ({
				id,
				name: `Skill (${id.substring(0, 8)}...)`,
				usageCount: 0,
			}));
		}
	}

	/**
	 * Clear the cache (useful for force refresh)
	 */
	clearCache(): void {
		this.skillsCache = null;
		this.cacheTimestamp = 0;
		console.log('✓ Skills cache cleared');
	}
}

export const skillService = new SkillService();

// Export convenience function for backward compatibility
export const fetchSkillsByIds = (skillIds: string[]): Promise<Skill[]> => {
	return skillService.getSkillsByIds(skillIds);
};