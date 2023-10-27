import { Affix, Button, Drawer, Flex, Text, Textarea, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const SubmissionComponent = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer opened={opened} onClose={close} position={"bottom"} padding={0} size={200} withCloseButton={false} style={{minHeight: 50}}>
        <Flex direction={"row"} gap={10} style={{padding: 10}}>
          <Flex direction={"column"}>
            <Text> Input: </Text>
            <Textarea minRows={5}/>
          </Flex>
          <Flex direction={"column"}>
            <Text> Expected Output: </Text>
            <Textarea minRows={5}/>  
          </Flex>
        </Flex>
      </Drawer>
      {!opened && <Affix position={{ bottom: rem(20), right: "50vw" }}>
        <Button
        onClick={opened ? close : open}
        radius={90}
        >
        Tests
        </Button>
      </Affix>}
    </>
  );
};

export default SubmissionComponent;