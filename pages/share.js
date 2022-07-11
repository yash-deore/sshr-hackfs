import dynamic from "next/dynamic";

const StreamEncrypt = dynamic(
  () => {
    return import("../components/stream-encrypt");
  },
  { ssr: false }
);

export default function Share() {
  return (
    <div style={{ margin: "0 5%" }}>
      <StreamEncrypt />
    </div>
  );
}
