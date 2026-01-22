import { HStack, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { JournalEntries } from "@/api/types/appwrite.js";

interface Props {
	journalEntry: JournalEntries;
}
export const JournalEntryItem: React.FC<Props> = ({ journalEntry }) => {
	return (
		<HStack
			w={"100%"}
			p={3}
			justifyContent={"space-between"}
			bg={{ base: "surface-container", _hover: "surface-container-high" }}
			borderRadius={"21px"}
		>
			<VStack>
				<Text>{journalEntry.content}</Text>
			</VStack>
			<VStack color={"on-surface-darkest"} fontSize={"14px"}>
				{dayjs(journalEntry.$createdAt).format("HH:mm")}
			</VStack>
		</HStack>
	);
};
