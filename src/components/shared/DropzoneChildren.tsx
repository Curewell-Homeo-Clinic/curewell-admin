import { PhotographIcon, UploadIcon, XIcon } from "@heroicons/react/outline";
import { Group, MantineTheme, Text } from "@mantine/core";
import { DropzoneStatus } from "@mantine/dropzone";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  style,
}: {
  status: DropzoneStatus;
  style: { color: string };
}) {
  if (status.accepted) return <UploadIcon style={style} className="w-20" />;

  if (status.rejected) return <XIcon style={style} className="w-20" />;

  return <PhotographIcon style={style} className="w-20" />;
}

export default function dropZoneChildren(
  status: DropzoneStatus,
  theme: MantineTheme
) {
  return (
    <Group
      position="center"
      spacing="xl"
      style={{ minHeight: 220, pointerEvents: "none" }}
    >
      <ImageUploadIcon
        status={status}
        style={{ color: getIconColor(status, theme) }}
      />

      <div>
        <Text size="xl" inline>
          Drag images here or click to select files
        </Text>
        <Text size="sm" color="dimmed" inline mt={7}>
          Attach any file (only one at a time) you like, it should not exceed
          5mb
        </Text>
      </div>
    </Group>
  );
}
