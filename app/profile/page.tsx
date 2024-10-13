import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InviteCard } from "@/components/user/invite-card";
import { db } from "@/lib/db";
import { Invite } from "@prisma/client";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // get invites data
  const invites = await db.invite.findMany({
    where: {
      recipientId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
      board: true,
      sender: true,
    },
  });

  return (
    <div className="mx-auto h-auto max-w-7xl overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <h2 className="text-2xl font-bold">Profile</h2>
      <Avatar>
        <AvatarImage
          alt={session.user.name ?? ""}
          src={session.user.image ?? ""}
        />
        <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
      </Avatar>
      <p>{session.user.name}</p>
      <Tabs className="w-full" defaultValue="invites">
        <TabsList className="bg-card">
          <TabsTrigger
            className="data-[state=active]:shadow-none data-[state=active]:bg-gray-100/50"
            value="invites"
          >
            <UserPlus className="w-4 h-4 mr-2" /> Invites
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:shadow-none data-[state=active]:bg-gray-100/50"
            value="youtubers"
          >
            YouTubers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="invites">
          <div>
            {invites.filter((invite) => invite.status === "PENDING").length >
            0 ? (
              invites
                .filter((invite) => invite.status === "PENDING")
                .map((invite) => (
                  <InviteCard key={invite.id} invite={invite as Invite} />
                ))
            ) : (
              <p>No invites</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="youtubers">
          <div className="h-80 max-w-5xl rounded-2xl bg-red-100 flex items-center justify-center border-[1px] border-red-200 mx-2">
            Test
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
