import { Breadcrumb } from "@chakra-ui/react";
import { Link, useLocation } from "@tanstack/react-router";

interface IBreadcrumb {
  title: string;
  path: string;
}

const getBreadcrumbs = (pathname: string) => {
  const breadcrumbs = pathname
    .split("/")
    .filter((e) => e)
    .reduce<IBreadcrumb[]>(
      (acc, current) => {
        const nextBread: IBreadcrumb = {
          title: current,
          path: acc[acc.length - 1].path + current + "/",
        };
        return [...acc, nextBread];
      },
      [{ path: "/", title: "/" }]
    );

  // console.log({ breadcrumbs });

  return breadcrumbs;
};

export const Breadcrumbs = () => {
  const pathname = useLocation().pathname;

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <Breadcrumb.Root
      w="100%"
      bg={"surface_container"}
      p="12px"
      borderRadius={"12px"}
    >
      <Breadcrumb.List>
        {breadcrumbs.map((bread, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
            <>
              <Breadcrumb.Item
                bg={{
                  base: isLast ? "primary" : "transparent",
                  _hover: "surface_container_highest",
                }}
                borderRadius={"6px"}
                transition={"backgrounds"}
              >
                <Breadcrumb.Link
                  asChild
                  color={{
                    base: isLast ? "black" : "text",
                    _hover: "text",
                  }}
                  fontWeight={"600"}
                  w={"100%"}
                  h="100%"
                  p={"4px 8px"}
                >
                  <Link to={`${bread.path}`}>{bread.title}</Link>
                </Breadcrumb.Link>
              </Breadcrumb.Item>
              {!isLast && <Breadcrumb.Separator color={"outline"} />}
            </>
          );
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  );
};
