import AxiosInstance from "./axios";
import ENV_SECRETS from "./ENV";

interface SignUp {

    username: string,
    email: string,
    password: string

};

interface SignUpResponse {

    success: boolean,
    message: string,
    data: {
        id: string,
        username: string,
        email: string
    }

};


export default async function SignupUser(userData: SignUp): Promise<SignUpResponse> {

    try {

        const res = await AxiosInstance.post<SignUpResponse>("/api/v1/user/signup", userData);

        return res.data;

    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }
};
