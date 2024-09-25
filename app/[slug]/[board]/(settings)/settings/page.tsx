export default async function BoardSettings({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
