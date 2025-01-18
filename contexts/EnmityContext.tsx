'use client';

import { EnmityServer } from "@/models/EnmityServer";
import { createContext, useCallback, useContext, useState } from "react";
import { StreamChat } from "stream-chat";
import { v4 as uuid } from 'uuid';

type EnmityState = {
    server?: EnmityServer;
    changeServer: (server: EnmityServer | undefined, client: StreamChat) => void;
    createServer: (
        client: StreamChat,
        name: string,
        imageUrl: string,
        userIds: string[]
    ) => void;
};

const initialValue: EnmityState = {
    server: undefined,
    changeServer: () => {},
    createServer: () => { },
};

const EnmityContext = createContext<EnmityState>(initialValue);

export const EnmityContextProvider: any = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [myState, setMyState] = useState<EnmityState>(initialValue);

    const changeServer = useCallback(
        async (server: EnmityServer | undefined, client: StreamChat) => {
            setMyState((myState) => {
                return { ...myState, server };
            });
        },
        [setMyState]
    );

    const createServer = useCallback(
        async (
            client: StreamChat,
            name: string,
            imageUrl: string,
            userIds: string[]
        ) => {
            const serverId = uuid();
            const messagingChannel = client.channel('messaging', uuid(), {
                name: 'Welcome',
                members: userIds,
                data: {
                    image: imageUrl,
                    serverId: serverId,
                    server: name,
                    category: 'Text Channels',
                },
            });

            try {
                const response = await messagingChannel.create();
                console.log('[EnmityContext - createServer] Response: ', response);
            } catch (err) {
                console.error(err);
            }

        },
        []
    );

    const store: EnmityState = {
        server: myState.server,
        changeServer: changeServer,
        createServer: createServer,
    };

    return (
        <EnmityContext.Provider value={store}>{children}</EnmityContext.Provider>
    );
};

export const useEnmityContext = () => useContext(EnmityContext);