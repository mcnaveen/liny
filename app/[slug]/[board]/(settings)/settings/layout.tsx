import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto h-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="flex w-full">
        <div className="mb-8 w-full lg:sticky lg:top-20 lg:mb-0 lg:w-[60%]">
          <Tabs>
            <TabsList>
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
