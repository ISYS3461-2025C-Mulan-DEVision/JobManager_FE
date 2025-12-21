import httpClient from "./httpClient";
import { ApiResponse } from "@/types";
import { CompleteProfilePayload } from "@/components/feature/Authentication/CompleteProfile/types";

const COMPANY_BASE_PATH = "/companies";

interface UpdateCompanyRequest {
    name: string;
    phone: string;
    streetAddress: string;
    city?: string;
    countryCode?: string;
}

const CompanyService = {
    updateCompanyProfile: async (
        companyId: string,
        payload: CompleteProfilePayload
    ): Promise<ApiResponse<any>> => {
        try {
            // 1. Update company details
            const updateRequest: UpdateCompanyRequest = {
                name: payload.companyName,
                phone: payload.phoneNumber,
                streetAddress: payload.address,
                // We might need to split address or just use it as streetAddress
                // For now, mapping address to streetAddress
            };

            const updateResponse = await httpClient.put<ApiResponse<any>>(
                `${COMPANY_BASE_PATH}/${companyId}`,
                updateRequest
            );

            if (!updateResponse.data.success) {
                return updateResponse.data;
            }

            // 2. Upload logo if provided
            if (payload.companyLogo) {
                const formData = new FormData();
                formData.append("file", payload.companyLogo);

                const logoResponse = await httpClient.post<ApiResponse<any>>(
                    `${COMPANY_BASE_PATH}/${companyId}/media/logo`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (!logoResponse.data.success) {
                    // If logo upload fails, we might want to warn but not fail the whole process
                    console.warn(
                        "Logo upload failed:",
                        logoResponse.data.message
                    );
                }
            }

            return updateResponse.data;
        } catch (error: any) {
            throw error.response?.data || error;
        }
    },

    getCompany: async (companyId: string): Promise<ApiResponse<any>> => {
        const response = await httpClient.get<ApiResponse<any>>(
            `${COMPANY_BASE_PATH}/${companyId}`
        );
        return response.data;
    },
};

export default CompanyService;
