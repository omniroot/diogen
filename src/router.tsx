import { getIssuesOptions } from "@/api/queries/issues.api.ts";
import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { client } from "@/api/query.client.ts";
import { GlobalLayout } from "@/components/layouts/global.layout.tsx";
import { HomePage } from "@/pages/home/home.page.tsx";
import { IssuePage } from "@/pages/issues/issue.page.tsx";
import { IssuesPage } from "@/pages/issues/issues.page.tsx";
import { ProjectIssuesPage } from "@/pages/projects/project/project.issues.page";
import { ProjectModulesPage } from "@/pages/projects/project/project.modules.page";
import { ProjectPage } from "@/pages/projects/project/project.page";
import { ProjectsPage } from "@/pages/projects/projects.page.tsx";
import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
	component: () => <GlobalLayout />,
});

export const HomeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: () => <HomePage />,
});

export const ProjectsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/projects",
	component: () => <ProjectsPage />,
});

export const ProjectRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/projects/$custom_id",
	component: () => <ProjectPage />,
	loader: ({ params }) => {
		client.prefetchQuery(getProjectOptions({ custom_id: params.custom_id }));
	},
});

export const ProjectIssuesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/projects/$custom_id/issues",
	component: () => <ProjectIssuesPage />,
	loader: ({ params }) => {
		client.prefetchQuery(getIssuesOptions({ project_id: Number(params.custom_id), count: "many" }));
	},
});

export const IssuesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/issues",
	component: () => <IssuesPage />,
	loader: () => {
		client.prefetchQuery(getIssuesOptions({ count: "many" }));
	},
});

export const IssueRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/issues/$issue_id",
	component: () => <IssuePage />,
	loader: async ({ params }) => {
		client.prefetchQuery(getIssuesOptions({ id: Number(params.issue_id), count: "one" }));
	},
});

export const ProjectModulesRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/projects/$custom_id/modules",
	component: () => <ProjectModulesPage />,
	// loader: ({ params }) => {
	//   client.prefetchQuery(getProjectOptions({ custom_id: params.custom_id }));
	// },
	// wrapInSuspense: true,
});

export const TestRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/test",
}).lazy(() => import("@/pages/test/test.page.tsx").then((c) => c.Route));

// export const LoginRoute = createRoute({
//   getParentRoute: () => rootRoute,
//   path: "/login",
//   component: () => <LoginPage />,
// });

const routeTree = rootRoute.addChildren([
	HomeRoute,
	TestRoute,
	ProjectsRoute,
	ProjectRoute,
	ProjectIssuesRoute,
	ProjectModulesRoute,
	IssuesRoute,
	IssueRoute,
]);

export const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	// defaultNotFoundComponent: () => <NotFoundPage />,
});

export const routeTypes = router.routesByPath;

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
