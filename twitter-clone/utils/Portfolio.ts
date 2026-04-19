import newRequest from "./newRequests";
export interface User {
    uid?: string
    name: string
    handle: string
    email: string
    password?: string
    avatar?: string
    verified?: boolean
}

export const createUser = async (portfolio: User)=>{
    const res = await newRequest.post("/user", portfolio);
    return res.data

}

export const loginUser = async (username:string, email: string) => {
    const res = await newRequest.post(`/login/`,{username, email})
    return res.data
}

export const getUser = async ()=>{
    const res = await newRequest.get("/user")
    return res.data;
}

export const updateUser = async (data: any) => {
  const res = await newRequest.put('/user', data)
  return res.data
}

export const deleteUser = async (id: string)=>{
    const res = await newRequest.delete(`/user/${id}`);
    return res.data
}
