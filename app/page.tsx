'use client';

import { useCallback, useEffect, useState } from "react";
import { User } from "stream-chat";
import { LoadingIndicator } from "stream-chat-react";
import { useUser } from "@clerk/clerk-react";  // Changed to useUser
import MyChat from '@/components/MyChat';

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
};

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState | undefined>();

  const { user: clerkUser } = useUser();  // Using useUser instead of useClerk

  const registerUser = useCallback(async () => {
    const userId = clerkUser?.id;
    const mail = clerkUser?.primaryEmailAddress?.emailAddress;

    if (userId && mail) {
      const response = await fetch('/api/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email: mail }),
      });
      
      const responseBody = await response.json();
      return responseBody;
    }
  }, [clerkUser]);

  async function getUserToken(userId: string, userName: string){
    const response = await fetch('/api/token', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ userId: userId}),
    });

    const responseBody = await response.json();
    const token = responseBody.token;

    if(!token) {
      console.error('No token found');
    }

    const user: User = {
      id: userId,
      name: userName,
      image: 'https://getstream.io/random_png/?id=${userId}&name=${userName}',
    };

   // console.log(apiKey);

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if(apiKey){
      setHomeState({ apiKey: apiKey, user: user, token: token});
    }
  }

  useEffect(() => {
    if(
      clerkUser?.id &&
      clerkUser?.primaryEmailAddress?.emailAddress &&
      !clerkUser?.publicMetadata.streamRegistered
    ){
      registerUser().then((result) => {
        getUserToken(
          clerkUser.id,
          clerkUser?.primaryEmailAddress?.emailAddress || 'Unknown'
        );
      });
    }
    else{
      if (clerkUser?.id){
        getUserToken(
          clerkUser?.id || 'Unknown',
          clerkUser?.primaryEmailAddress?.emailAddress || 'Unknown'
        );
      }
    }
  }, [registerUser, clerkUser]);

  if (!homeState) {
    return <LoadingIndicator />;
  }

  return <MyChat {...homeState} />;
}