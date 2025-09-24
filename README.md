# Diogen

write vite plugin who replace normal import to lazy import
`const GraphFeedItem = React.lazy(() => import('./GraphFeedItem'))`

## TODO for 1.0.0 version

- [ ] General
  - [x] Add biome js
  - [x] Write LazyInput vite plugin
  - [ ] Add husky

- [ ] API
  - [ ] Projects Api
  - [ ] Issues Api
  - [ ] Modules Api

- [ ] Pages
  - [ ] Project Page
  - [ ] Issue Page

- [ ] Business Components
  - [ ] IssueList
  - [ ] IssueItem
  - [ ] ModuleList
  - [ ] ModuleItem

- [ ] Rewrite all using useQuery to router loader
- [ ] Use mini api for sidebar project
