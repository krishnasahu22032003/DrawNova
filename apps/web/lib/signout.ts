import AxiosInstance from "./axios";

interface SignOutResponse {

success:boolean ,
message:string

};

export default async function UserSignOut():Promise<SignOutResponse>{


try{

const res = await AxiosInstance.delete<SignOutResponse>("/api/v1/user/signout");

return res.data ; 

}catch(error : any){

    throw new Error(error.response.data.message || "SignOut Failed");

};

};