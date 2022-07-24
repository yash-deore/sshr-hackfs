import dynamic from "next/dynamic";

const DecryptStreamLink = dynamic(
  () => {
    return import("../../components/stream-decrypt-link");
  },
  { ssr: false }
);

export default function StreamDecryptLink() {
  return (
    <div style={{ margin: "0 5%" }}>
      <DecryptStreamLink />
    </div>
  );
}
