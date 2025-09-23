import { IIssue } from "@/api/supabase.interface.ts";
import { LabelMenu } from "@/components/business/LabelMenu.tsx";
import {
  chakra,
  Checkbox,
  HStack,
  HTMLChakraProps,
  Text,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FC, forwardRef } from "react";

interface IIssueItem extends HTMLChakraProps<"div"> {
  issue?: IIssue;
}

export const IssueItem: FC<IIssueItem> = forwardRef<HTMLDivElement, IIssueItem>(
  ({ issue, ...props }, ref) => {
    return (
      <chakra.div
        w={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        px={2}
        py={3}
        bg={{ _default: "transparent", _hover: "hover" }}
        borderRadius={"sm"}
        ref={ref}
        {...props}
        asChild
      >
        <Link
          to="/issues/$issue_id"
          params={{
            issue_id: String(issue?.id),
          }}
          preload={false}
        >
          <HStack w={"100%"} justifyContent={"start"} alignItems={"center"}>
            <Checkbox.Root defaultChecked={issue?.completed}>
              <Checkbox.HiddenInput />
              <Checkbox.Control
                borderColor={"outline_variant"}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox.Root>
            <Text color={"subtext"}>{issue?.custom_id}</Text>
            <Text color={"text"}>{issue?.title}</Text>
          </HStack>
          <HStack justifyContent={"end"} alignItems={"center"}>
            <LabelMenu issue={issue} isShow={!!issue?.label} />
          </HStack>
        </Link>
      </chakra.div>
    );
  }
);
