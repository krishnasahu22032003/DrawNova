import AxiosInstance from "./axios";

interface SignIn {

    email: string,
    password: string

};

interface SignInResponse {

    success: boolean,
    message: string,
    data: {
        id: string,
        username: string,
        email: string
    }

};


export default async function UserSignIn(SignData: SignIn): Promise<SignInResponse> {

    try {

        const res = await AxiosInstance.post<SignInResponse>("/api/v1/user/signin", SignData);

        return res.data;

    } catch (error: any) {

        throw new Error(error.response.data.message || "Signin Failed")

    };

};