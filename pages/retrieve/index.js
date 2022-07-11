import dynamic from "next/dynamic";

const StreamDecrypt = dynamic(
  () => {
    return import("../../components/stream-decrypt");
  },
  { ssr: false }
);

export default function Retrieve() {
  return (
    <div style={{ margin: "0 5%" }}>
      <StreamDecrypt />
    </div>
  );
}
