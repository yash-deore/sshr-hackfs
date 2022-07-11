import { Button, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Copy } from "tabler-icons-react";

export function ButtonCopy({ link }) {
  const clipboard = useClipboard();
  return (
    <Tooltip
      label="Link copied!"
      gutter={5}
      placement="center"
      position="bottom"
      radius="xl"
      transition="slide-down"
      transitionDuration={200}
      opened={clipboard.copied}
    >
      <Button
        variant="light"
        rightIcon={<Copy size={20} />}
        radius="xl"
        size="md"
        styles={{
          root: { paddingRight: 14, height: 48 },
          rightIcon: { marginLeft: 22 },
        }}
        onClick={() => clipboard.copy(link)}
      >
        Copy link to clipboard
      </Button>
    </Tooltip>
  );
}
