// Now why we are using Zustand ?
// we will not create all the time this authentication function across all the components of our app so basically our all the  functions which help to authenticate the user instead of defining across all the app we are defining here only and using Zustand we can spread it from here across all the app without writting all the code again and again 
// help to remove redundancy

// axios use to connect thee frontend and backend to communicate in between them 


import {create} from "zustand"
import {axiosInstance} from "../lib/axios.js"
import toast from "react-hot-toast";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/api" : "/";

export const useAuthStore = create((set , get) => ({
    authUser : null,
    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,
    isCheckingAuth : false,
    onlineUsers : [],
    socket : null,
    


    checkAuth : async () => {
        set({isCheckingAuth : true});
        try {
            const res = await axiosInstance.get("/auth/check");  
            // this is the api call to backend (api is basically use to connect the backend and frontend) now this request will fetch the data from the backend from /auth/check this end url the baseUrl we already provided while creating the axiosInstance 
            set({authUser : res.data}); 
            get().connectSocket();
        } catch (error) {
            console.log("error in check auth" + error);
            set({authUser : null})
        } finally {
            set({isCheckingAuth : false})
        }
    },

    signup : async (data) => {

        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("/auth/signup" , data)
            set({authUser : res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set ({ isSigningUp : false});
        }

    },

    login : async (data) => {
        set({isLoggingIn : true})
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser : res.data});
            toast.success("WELCOME BACK BUDDY!" , {
                icon : "🤩",
            });
            get().connectSocket();
        } catch (error) {
            toast.error("Some Error occured" + error.message);
        } finally{
            set({isLoggingIn : false})
        }
    },

    updateProfile : async (data) => {
        set({isUpdatingProfile : true});
        try {
            const res = await axiosInstance.put("/auth/update-ProfilePic" , data);
            set({authUser : res.data});
            toast("Image uploaded Successfully" , {
                icon : "📷",
            })
        } catch (error) {
            toast.error("Some error occured" + error.message)
        }finally{
            set({isUpdatingProfile : false})
        }
    },

    logout : async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser : null});
            toast.success("logout successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Some Error occured" + error);
        }
    },

    connectSocket : async () => {

        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL , {
            query : {
                userId : authUser._id,
            },
        });
        socket.connect();
        set({socket : socket})

        socket.on("getOnlineUsers" , (userIds) => {
            set({onlineUsers :userIds})
        })
    },

    disconnectSocket : async () => {
        if(get().socket?.connected) get().socket.disconnect();
    },
}))