import { Inngest } from "inngest";
import User from "../models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "prime-show" });
const syncUserCreation = inngest.createFunction(
    {id : 'sync-user-form-clerk'},
    {event: 'clerk/user.created'},
    async({event})=>{
        const{id , first_name , last_name, email_addreses , image_url} = event.data;
        const userData = {
            _id : id,
            name : `${first_name} ${last_name}`,
            email : email_addreses[0].email_address,
            image : image_url
        }
        await User.create(userData);
    }
);
    const syncUserDeletion = inngest.createFunction(
        {id : 'delete-user-with-clerk'},
        {event: 'clerk/user.deleted'},
        async({event})=>{
            const {id} = event.data;
            await User.findByIdAndDelete({_id: id});
        }
);
const syncUserUpdation = inngest.createFunction(
    {id : 'sync-user-form-clerk'},
    {event: 'clerk/user.updated'},
    async({event})=>{
        const{id , first_name , last_name, email_addreses , image_url} = event.data;
        const userData = {
            _id : id,
            name : `${first_name} ${last_name}`,
            email : email_addreses[0].email_address,
            image : image_url
        }
        await User.create(userData);
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion , syncUserUpdation];