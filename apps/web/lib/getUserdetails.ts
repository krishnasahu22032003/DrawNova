import AxiosInstance from "./axios";

interface Data {

    id: string,
    username: string,
    email: string

};

interface GetUserDetailsResponse {

    success: boolean,
    data: Data
};

export default async function GetUserDetails(): Promise<GetUserDetailsResponse> {

    try {

        const res = await AxiosInstance.get<GetUserDetailsResponse>("/api/v1/user/me");

        return res.data;
    } catch (error: any) {
        throw new Error(error.response.data.message || "Something went wrong")
    };

};