import { store } from '../../stores/store';
import {
    setCurrentGuildById,
    setCurrentChannelById,
    setChannels,
    setMembers,
    setMessages,
    removeGuild,
} from '../../stores/slices/UserSlice';
import { requestChannels } from '../../api/ChannelAPI';
import { getMembersInServer } from '../../api/MemberAPI';
import { requestMessages } from '../../api/MessageAPI';
import { Channel } from '../../models/server-hierarchy/Channel';
import { ServerMember } from '../../models/server-hierarchy/ServerMember';
import { Message } from '../../models/server-hierarchy/Message';
import type { ChannelDB } from '../../models/db/ChannelDB';
import type { ServerMemberDB } from '../../models/db/ServerMemberDB';
import type { MessageDB } from '../../models/db/MessageDB';

export async function switchToServer(guildId: number) {
    // Fetch all data for the new server before touching Redux state —
    // this avoids intermediate renders with mismatched guild/channel data.
    const rawChannels = await requestChannels(guildId);
    const rawMembers = await getMembersInServer(guildId);

    const channels = (rawChannels ?? []).map((c: ChannelDB) =>
        Channel(c.server_id, c.channel_id, c.name),
    );
    const members = (rawMembers ?? []).map((m: ServerMemberDB) =>
        ServerMember(m.user_id, m.username, m.server_id),
    );

    const firstChannelId = channels.length > 0 ? channels[0].channelId : -1;

    let messageList: ReturnType<typeof Message>[] = [];
    if (firstChannelId !== -1) {
        const rawMessages = await requestMessages(guildId, firstChannelId);
        messageList = (rawMessages ?? []).map((msg: MessageDB) =>
            Message(msg.guild_id, msg.channel_id, msg.message_id, msg.message_text, msg.author_name),
        );
    }

    // Dispatch all state changes in one synchronous block — React 18 batches
    // these into a single render with everything consistent from frame one.
    store.dispatch(setCurrentGuildById(guildId));
    store.dispatch(setChannels(channels));
    store.dispatch(setMembers(members));
    store.dispatch(setCurrentChannelById(firstChannelId));
    store.dispatch(setMessages(messageList));
}

export async function leaveServer(guildId: number) {
    store.dispatch(removeGuild(guildId));
}