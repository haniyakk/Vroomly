// src/screens/MessagesScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../types';
import { supabase } from '../backend/supabaseClient'; // <-- adjust path if your supabase client is elsewhere

type Msg = {
    id: number | string;
    sender_id: string;
    receiver_id: string;
    message_text: string;
    created_at: string;
    sender_name?: string; // optional
};

const MessagesScreen: React.FC = () => {
    const { setScreen, user } = useAppContext();
    const [messages, setMessages] = useState<Msg[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // driverId for the room:
    // - if current user is driver -> driverId = user.id
    // - if current user is student -> driverId = student's driver_id (we fetch it)
    const [driverId, setDriverId] = useState<string | null>(null);
    const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]); // all student ids in this driver group
    const [displayName, setDisplayName] = useState<string>(''); // driver or group's name to show in header

    useEffect(() => {
        let mounted = true;
        const initialize = async () => {
            if (!user) return;

            // 1) fetch current user's full profile from users table
            const { data: myProfile, error: profErr } = await supabase
                .from('users')
                .select('id, name, driver_id')
                .eq('id', user.id)
                .single();

            if (profErr) {
                console.error('Could not fetch profile', profErr);
                return;
            }

                        // compute driverId (safer): drivers should use their own user.id, students use their profile.driver_id
                        const myDriverId = user.user_type === 'driver'
                            ? user.id
                            : myProfile.driver_id;
            if (!myDriverId) {
                // no driver assigned yet
                setDriverId(null);
                setMessages([]);
                return;
            }
            if (!mounted) return;
            setDriverId(myDriverId);

            // 2) fetch all students assigned to this driver (group members)
            const { data: students, error: studentErr } = await supabase
                .from('users')
                .select('id, name')
                .eq('driver_id', myDriverId);

            if (studentErr) {
                console.error('Could not fetch students', studentErr);
                return;
            }

            if (!mounted) return;
            const ids = (students || []).map((s: any) => s.id);
            setGroupMemberIds(ids);

            // 3) set display name = driver name
            const { data: driverRow } = await supabase.from('users').select('id,name').eq('id', myDriverId).single();
            setDisplayName(driverRow ? driverRow.name : 'Driver');

            // 4) load existing messages for this driver room
            // We store group messages with receiver_id = driverId.
            const { data: msgs, error: msgsErr } = await supabase
                .from('messages')
                .select('id, sender_id, receiver_id, message_text, created_at')
                .or(`receiver_id.eq.${myDriverId}, sender_id.in.(${[myDriverId, ...ids].map((i: string) => `"${i}"`).join(',')})`)
                .order('created_at', { ascending: true });

            // Simpler query: since all group messages use receiver_id = driverId, we can just filter by receiver_id:
            // const { data: msgs, error: msgsErr } = await supabase
            //   .from('messages')
            //   .select('*')
            //   .eq('receiver_id', myDriverId)
            //   .order('created_at', { ascending: true });

            if (msgsErr) {
                console.error('Could not fetch messages', msgsErr);
            } else {
                // map messages to include local sender names if possible
                const senderMap: Record<string, string> = {};
                (students || []).forEach((s: any) => (senderMap[s.id] = s.name));
                // include driver name:
                if (driverRow) senderMap[driverRow.id] = driverRow.name;

                const normalized = (msgs || []).map((m: any) => ({
                    ...m,
                    sender_name: senderMap[m.sender_id] || (m.sender_id === myDriverId ? driverRow?.name : 'Unknown'),
                }));
                setMessages(normalized);
            }
        };

        initialize();

        return () => {
            mounted = false;
        };
    }, [user]);

    // realtime subscription: listen for new messages for this driver room
    useEffect(() => {
        if (!driverId) return;

        // subscribe to new inserts where receiver_id = driverId (group messages)
        const channel = supabase.channel(`public:messages:driver_${driverId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${driverId}` },
                (payload) => {
                    const newMsg = payload.new as Msg;
                    setMessages(prev => [...prev, newMsg]);
                    // auto-scroll handled below
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [driverId]);

    // autoscroll when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // sending a message:
    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newMessage.trim()) return;
        if (!user || !driverId) return;

        const payload = {
            sender_id: user.id,
            receiver_id: driverId, // driver is the room id
            message_text: newMessage.trim(),
        };

        // optimistic UI
        const tempId = `temp-${Date.now()}`;
        setMessages(prev => [
            ...prev,
            { id: tempId, ...payload, created_at: new Date().toISOString(), sender_name: user.fullName || 'Me' }
        ]);
        setNewMessage('');

        const { data, error } = await supabase.from('messages').insert([payload]);
        console.log("DEBUG insert response:", data, error);
        if (error) {
            console.error('Send message error', error);
            // optionally show failure and remove temp message
        }
        // server will push final message via realtime; optionally reconcile duplicates later
    };

    return (
        <div className="w-full h-full flex flex-col text-white">
            <header className="p-4 flex items-center border-b border-white/10">
                <button onClick={() => setScreen(Screen.DASHBOARD)} className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>

                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 mr-3 flex items-center justify-center">
                        <span className="text-sm font-semibold text-white">{displayName ? displayName.charAt(0) : 'D'}</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold">{displayName || 'Group Chat'}</h1>
                        <p className="text-xs text-green-400">Online</p>
                    </div>
                </div>
            </header>

            <main className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.sender_id === user?.id ? 'bg-[#FFA8A8] text-[#3A3A69] rounded-br-none' : 'bg-white/10 text-white rounded-bl-none'}`}>
                            <p className="font-semibold text-sm">{msg.sender_name}</p>
                            <p>{msg.message_text}</p>
                        </div>
                        <span className="text-xs text-white/50 mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 border-t border-white/10">
                <form onSubmit={handleSend} className="flex items-center bg-[#2E2E55] rounded-full p-1">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-grow bg-transparent text-white px-4 py-2 focus:outline-none"
                    />
                    <button type="submit" className="bg-[#FFA8A8] rounded-full p-3 text-[#3A3A69] hover:bg-pink-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

export default MessagesScreen;
