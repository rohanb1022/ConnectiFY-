import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set , get) => ({
    messages : [],
    users : [],
    isUsersLoading : false,
    isMessageLoading : false,
    SelectedUser : null,

    // getUser : async () => {
    //     set({isUserLoading : true});
    //     try {
    //       const res = await axiosInstance.get("/messages/users");
    //       set({users  : res.data})
    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.message);
    //     } finally{
    //         set({isUserLoading : false})
    //     }

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          console.log("Full response:", res.data);
      
          // Ensure filteredUsers is properly retrieved
          const usersArray = Array.isArray(res.data.filteredUsers)
            ? res.data.filteredUsers
            : [];
          set({ users: res.data });
      
          console.log("Filtered Users:", usersArray); // Debugging
        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to load users: " + error.message);
        } finally {
          set({ isUserLoading: false });
        }
      },
      
           
            // Frontend:
                // The getUser function in your store is called when you need to fetch the list of users.
                // This function makes an API call to /messages/users using axiosInstance.
        
            // Backend:
                // The backend has a route (/messages/users) that listens for the request.
                // When the request comes in, the backend fetches user data (probably from a database) and sends it back as a response.

            // Frontend:
                // The frontend receives the user data in res.data and updates the state 
                // (set({users: res.data})), making the user list available for rendering.    

    getMessages : async (userId) => {
        set({isMessageLoading : true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages : res.data})
        } catch (error) {
            toast.error("Internal Server Error Occurred" + error.message);
        }finally{
            set({isMessageLoading : false})
        }
    },

    sendMessage : async (messageData) => {
      const {messages , selectedUser} = get();
      try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}` , messageData);
        set({messages : [...messages , res.data]})
      } catch (error) {
        toast.error("Internal Error Occured" + error.message);
      }
    },

    subscribeToMessages: () => {
      const { selectedUser } = get();
      if (!selectedUser) return;
  
      const socket = useAuthStore.getState().socket;
  
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;
  
        set({
          messages: [...get().messages, newMessage],
        });
      });
    },
  
    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage");
    },
  
    setSelectedUser: (selectedUser) => set({ selectedUser }),

  }));