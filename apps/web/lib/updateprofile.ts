import AxiosInstance from "./axios";

interface UpdateProfile {

    email?: string,
    username?: string,
    password?: string

};

interface UpdateUser {

    id: string,
    email: string,
    username: string,
    updatedAt: Date

};

interface UpdateUserResponse {

    success: boolean,
    message: string,
    data: UpdateUser

};

export default async function UpdateUserDetails(UserData: UpdateProfile): Promise<UpdateUserResponse> {

    try {

        const res = await AxiosInstance.post<UpdateUserResponse>("/api/v1/user/update", UserData);

        return res.data;

    } catch (error: any) {

        throw new Error(error.response?.data?.message || "Update Profile Failed")
        ;
    }

};