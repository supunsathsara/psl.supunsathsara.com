"use client"

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/superbase/client";
import Image from "next/image";

export const dynamic = 'force-dynamic'


type Expert = {
    created_at: string;
    email: string;
    event: string;
    github_username: string;
    id: string;
    lessonId: string;
    name: string;
    postmanCollectionJsonUrl: string;
    publishedCourseId: string;
    reg_no: number;
  };

export default function Home({ params }: any) {
    const supabase = createClient();
    const [experts, setExperts] = useState<Expert[]>([]);
  
    useEffect(() => {
      // Fetch initial data
      const fetchInitialData = async () => {
        const { data, error } = await supabase
          .from('PS-experts')
          .select('*')
          .order('created_at', { ascending: false });
  
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setExperts(data);
        }
      };
  
      fetchInitialData();
  
      // Set up subscription
      const channel = supabase
        .channel('pse-user-updates')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'PS-experts' },
          (payload) => {
            setExperts((prevExperts) => [payload.new as Expert, ...prevExperts]);
            console.log('Change received!', payload);
          }
        )
        .subscribe();
  
      // Cleanup subscription on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }, []);
  
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#FF6C37]">
        <h1 className="text-4xl font-bold text-white mb-8">Postman Student Expert Certification</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {experts.map((expert, index) => (
            <div key={expert.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
              <span className="text-xl font-bold text-gray-500 mb-2">
                {String(experts.length - index).padStart(2, '0')}
              </span>
              <Image
                src={`https://github.com/${expert.github_username || 'Otojon'}.png`}
                alt={expert.name}
                width={100}
                height={100}
                className="rounded-full"
              />
              <h2 className="text-2xl font-semibold mt-4">{expert.name}</h2>
              <p className="text-gray-700">{expert.email}</p>
              <a
                href={expert.postmanCollectionJsonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-blue-500 underline"
              >
                View Postman Collection
              </a>
            </div>
          ))}
        </div>
      </main>
    );
  }