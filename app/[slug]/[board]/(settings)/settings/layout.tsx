import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex w-full">
        <div className="w-full lg:w-[60%] mb-8 lg:mb-0 lg:sticky lg:top-20">
          <Tabs>
          <TabsList >
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="permission">Permissions</TabsTrigger>
            </TabsList>
            <TabsContent value="general">This is a General</TabsContent>
            <TabsContent value="permission">This is a Permission</TabsContent>
          </Tabs>
        </div>
        <div className="1/2">{children}</div>
      </div>
    </div>
  );
}
