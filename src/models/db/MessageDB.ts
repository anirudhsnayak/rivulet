export interface MessageDB {
    guild_id: number;
    channel_id: number;
    user_id: number; //relabel this to author_id for consistency with discord api and to avoid confusion with the user_id field in the UserModel which is the id of the user in our system and not their discord id
    message_id: number;
    message_text: string;
}