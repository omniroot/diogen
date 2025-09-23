import { getProjectsOptions } from "@/api/queries/projects.api.ts";
import { createListCollection, Portal, Select } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";

export const ProjectSelect = () => {
  let custom_id = null;
  // try {
  custom_id = useParams({ strict: false }).custom_id || null;
  // } catch {
  //   console.log("Project not found. Retard rewrite this shit");
  // }
  const { data: projects } = useQuery(getProjectsOptions());
  const collection = createListCollection({
    items: projects || [],
    itemToString: (item) => item.title,
    itemToValue: (item) => item.custom_id,
  });

  return (
    <Select.Root
      collection={collection}
      size="sm"
      w={"100%"}
      defaultValue={[custom_id || ""]}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger
          // w={"150px"}
          height={"40px"}
          border={"none"}
          bg={{ _hover: "hover", _expanded: "hover" }}
          borderRadius={"md"}
          cursor={"pointer"}
        >
          <Select.ValueText placeholder="Select framework" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content
            bg={"surface"}
            border={"1px solid {colors.outline}"}
            borderRadius={"md"}
          >
            {collection.items.map((project) => (
              <Select.Item
                item={project}
                key={project.id}
                color={{ base: "text", _selected: "text_primary" }}
                bg={{ _hover: "hover", _selected: "primary" }}
                cursor={"pointer"}
                borderRadius={"sm"}
                asChild
              >
                <Link
                  to="/projects/$custom_id"
                  params={{ custom_id: project.custom_id }}
                >
                  {project.title}
                  <Select.ItemIndicator />
                </Link>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
