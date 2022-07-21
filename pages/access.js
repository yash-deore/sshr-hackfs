import dynamic from "next/dynamic";

const AccessControlShares = dynamic(
  () => {
    return import("../components/access-control-shares");
  },
  { ssr: false }
);

export default function Access() {
  return (
    <div style={{ margin: "0 5%" }}>
      <AccessControlShares />
    </div>
  );
}
