# План для фичи **Posts / News** — база данных + архитектура + примеры кода

Ниже — готовая, практичная схема: таблицы БД (Postgres / Supabase-compatible), архитектурное расположение файлов в репозитории (с учётом твоих требований — всё внутри `features/posts`), и минимальные примеры инфраструктуры, domain-функций, application-hooks и компонентов. Всё сделано так, чтобы соблюдалась чёткая граница **UI → application → domain → infrastructure** и чтобы можно было редактировать/черновать/публиковать посты с версионированием.

---

# 1. Таблица БД (Postgres / Supabase)

Основные таблицы:

- `posts` — основная сущность (метаданные)
- `post_versions` — версии содержимого (markdown/HTML), нужна для ревизий
- `tags` — теги
- `posts_tags` — связь many-to-many
- `authors` — пользователи/авторы (в реальной схеме можно ссылаться на существующую users)

## SQL (пример)

```sql
-- posts: метаданные, статус и актуальная версия (published_version_id)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft | published | archived
  published_version_id UUID, -- FK -> post_versions.id
  is_featured BOOLEAN DEFAULT FALSE,
  visibility TEXT NOT NULL DEFAULT 'public', -- public | private
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- post_versions: хранит содержимое, автора версии, summary изменений
CREATE TABLE post_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  content_html TEXT, -- опционально, можно хранить для ускорения рендера
  author_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  change_summary TEXT
);

-- теги
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- связь posts <-> tags
CREATE TABLE posts_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- index для быстрого поиска по slug и времени
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- fulltext search (пример)
ALTER TABLE posts ADD COLUMN search_vector tsvector;
CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
-- триггер для обновления search_vector можно добавить по title + excerpt + content_html
```

### Замечания

- Храним версии содержимого отдельно, чтобы: откатываться, делать аудиты и показывать diff.
- `posts.published_version_id` указывает на актуальную опубликованную версию (NULL — если нет опубликованной).
- `status` хранит состояние: `draft`, `published`, `archived`.
- Возможна отдельная таблица `attachments` для изображений/файлов (хранится в S3/Supabase Storage) с `post_id` FK или отдельной связью.

---

# 2. Файловая структура (рекомендуемая, внутри `features/posts`)

```txt
features/posts
├── api
│   ├── posts.api.ts           # repository / infra — CRUD, versions, tags, publish
│   └── storage.api.ts         # attachments (optional)
│
├── domain
│   ├── post.model.ts          # типы/интерфейсы Post, PostVersion, Tag
│   ├── post.rules.ts          # canEdit, canPublish, validation
│   └── post.utils.ts          # generateSlug, sanitizeHtml, renderMarkdown
│
├── application
│   ├── usePosts.ts            # list, pagination
│   ├── usePost.ts             # single post (by id/slug)
│   ├── useCreatePost.ts
│   ├── useUpdatePost.ts
│   ├── usePublishPost.ts
│   └── usePostEditorAutosave.ts
│
├── components
│   ├── PostList.tsx
│   ├── PostCard.tsx
│   ├── PostView.tsx
│   ├── PostEditor
│   │   ├── PostEditor.tsx     # markdown editor wrapper
│   │   └── PostEditorToolbar.tsx
│   └── PostAdminToolbar.tsx
│
├── pages
│   ├── PostsIndex.tsx
│   ├── PostNew.tsx
│   └── PostEdit.tsx
└── index.ts
```

- `features/*/api` — здесь находятся функции-обёртки над `src/api` clients или прямые repository, реализующие контракт для application.
- `application` содержит все hooks с `useQuery`/`useMutation`. Они используют `api` + `domain` функции.
- `domain` — чистая бизнес-логика, не использует React/HTTP.
- `components` — презентационные компоненты.

---

# 3. Infrastructure (пример псевдо-кода — repository)

Файл: `features/posts/api/posts.api.ts`

```ts
// posts.api.ts — repository (инфраструктура)
import { db } from "@/api/clients/supabaseClient"; // пример
import type { PostRow, PostVersionRow } from "./types";

export const postsRepo = {
  async listPublished({ limit = 20, offset = 0, tag, q }) {
    // пример использования SQL или SDK
    // вернуть posts JOIN published_version content
  },

  async getBySlug(slug) {
    // SELECT p.*, pv.* FROM posts p LEFT JOIN post_versions pv ON pv.id = p.published_version_id WHERE p.slug = $1
  },

  async createPost({ authorId, title, markdown, changeSummary, tags }) {
    // транзакция:
    // 1) INSERT INTO posts (slug, title, author_id) RETURNING id
    // 2) INSERT INTO post_versions (post_id, title, content_markdown, author_id, change_summary) RETURNING id
    // 3) INSERT INTO posts_tags...
    // вернуть созданный пост
  },

  async createVersion(postId, { authorId, title, markdown, changeSummary }) {
    // INSERT INTO post_versions
  },

  async publishVersion(postId, versionId, publishedBy) {
    // UPDATE posts SET published_version_id = versionId, status='published', updated_at=now()
  },

  async updatePostMetadata(postId, patch) {
    /* ... */
  },

  async deletePost(postId) {
    /* ... */
  },

  async getVersions(postId) {
    /* ... */
  },
};
```

Принцип: repository знает про БД, но НЕ про React, не делает преобразований бизнес-логики.

---

# 4. Domain: правила и утилиты (псевдокод)

Файл: `features/posts/domain/post.rules.ts`

```ts
// post.rules.ts — чистые функции
export function generateSlug(title: string): string {
  // транслитерация + lower + replace spaces -> dash, плюс check uniqueness в repo при создании
}

export function validatePostInput(input: { title; markdown }) {
  if (!input.title || input.title.trim().length < 3) {
    return { ok: false, error: "Title too short" };
  }
  if (!input.markdown || input.markdown.trim().length === 0) {
    return { ok: false, error: "Content required" };
  }
  return { ok: true };
}

export function canEditPost(post, user) {
  // права редактирования
  return user.isAdmin || post.author_id === user.id;
}

export function applyPublishRules(post) {
  // например: must have at least 1 paragraph, not empty, etc.
}
```

Замечание: все эти функции не используют сеть/React/DB.

---

# 5. Application: hooks с TanStack Query (псевдокод)

Файл: `features/posts/application/usePosts.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import { postsRepo } from "../api/posts.api";
import { sortPostsByDate } from "../domain/post.utils";

export function usePosts({ page = 1, tag, q } = {}) {
  return useQuery(
    ["posts", { page, tag, q }],
    async () => {
      const { posts } = await postsRepo.listPublished({
        limit: 20,
        offset: (page - 1) * 20,
        tag,
        q,
      });
      return posts.map((p) => ({
        ...p,
        preview: p.excerpt || p.content_html.slice(0, 240),
      }));
    },
    {
      keepPreviousData: true,
    }
  );
}
```

Файл: `features/posts/application/useCreatePost.ts`

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsRepo } from "../api/posts.api";
import { generateSlug, validatePostInput } from "../domain/post.rules";

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation(
    async ({ title, markdown, tags, authorId }) => {
      const v = validatePostInput({ title, markdown });
      if (!v.ok) throw new Error(v.error);

      const slug = await generateSlug(title); // может быть sync, но uniqueness проверяется в repo
      const post = await postsRepo.createPost({
        authorId,
        title,
        markdown,
        slug,
        tags,
      });
      return post;
    },
    {
      onSuccess: () => qc.invalidateQueries(["posts"]),
    }
  );
}
```

`useUpdatePost`, `usePublishPost` — аналогично: проверка domain-функций, вызов repo, инвалидация кеша.

---

# 6. Компоненты (контракты и примеры)

### `PostList.tsx` — компонент списка

- props: none (берёт данные через hook `usePosts`)
- рендерит `PostCard` для каждого поста

```tsx
function PostList() {
  const { data: posts, isLoading } = usePosts({ page: 1 });
  if (isLoading) return <Spinner />;

  return (
    <div>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
    </div>
  );
}
```

### `PostView.tsx` — просмотр поста

- props: `slug` (или берёт из роутера)
- использует `usePost(slug)` (application hook)
- отображает `post.content_html` (предварительно sanitize и render в domain)

### `PostEditor.tsx` — редактор

- props: `initialPost?`
- использует `useCreatePost` / `useUpdatePost`
- autosave реализовать в `usePostEditorAutosave` (application hook), который сохраняет черновик (через `postsRepo.createVersion` с `status:draft`)

---

# 7. Рабочие сценарии и транзакции

1. **Создать черновик**
   - UI вызывает `useCreatePost.mutate({title, markdown, authorId})`
   - repository создаёт `posts` + initial `post_versions` (status draft)

2. **Редактировать**
   - редактор вызывает `postsRepo.createVersion(postId, {...})` (создаётся новая версия)
   - можно показывать последнюю version preview, но `posts.published_version_id` остаётся прежним

3. **Опубликовать**
   - `usePublishPost`:
     - проверяет domain: `applyPublishRules`
     - repository.publishVersion(postId, versionId)
     - update posts.status -> 'published', set published_version_id
     - invalidate cache

4. **Откат / ревизии**
   - `getVersions(postId)` — список версий, UI предлагает `revertTo(versionId)` — publishVersion с выбранной версией (или сохраняет новый version и публикует её)

---

# 8. Права доступа и аудит

- `post_versions` хранит `author_id` — кто сделал версию.
- Логи публикаций можно хранить отдельно `post_audit` с `action`, `user_id`, `timestamp`.
- `canEditPost` и `canPublishPost` в `domain` контролируют доступ; UI и API должны проверять их.

---

# 9. Хранение медиа (опционально)

- Отдельная таблица `attachments` с `url`, `storage_key`, `post_id?`, `uploaded_by`.
- Рекомендация: хранить файлы в S3/Supabase Storage и в `content_markdown` ссылаться на `https://cdn...`
- При удалении версии/поста — чистить orphan attachments (в background-job).

---

# 10. Тесты и валидация

- Unit: `domain` (validatePostInput, generateSlug, canEditPost).
- Integration: `postsRepo` (транзакции, publish flow).
- E2E: создание → редактирование → публикация → просмотр.

---

# 11. Роутинг (пример)

```
/posts                -> PostsIndex (PostList)
/posts/new            -> PostNew (PostEditor for create)
/posts/:slug          -> PostView
/posts/:id/edit       -> PostEdit (PostEditor for edit)
```

`/admin/posts` — можно отдельный админ интерфейс с фильтрами по статусам и ревизиями.

---

# 12. Ключевые практические советы / контрольные точки

1. **Версионирование содержимого** — обязательное. Хранить markdown отдельно от метаданных.
2. **Domain должен проверять правила** (validation, canEdit, canPublish) и быть полностью без side-effects.
3. **Application hooks** — единственное место, где используются `useQuery`/`useMutation`.
4. **Repository / API** — не содержит logic, только DB/SDK операции.
5. **Slug uniqueness** — генерировать/нормализовать на domain-уровне, проверять/фиксировать в репозитории (транзакция).
6. **Sanitize HTML** — рендерить Markdown → HTML через проверенный renderer и sanitize (в domain/utils), либо рендерить на сервере.
7. **Кеширование** — инвалидация `['posts']` после публикации/создания/удаления.
8. **Autosave** — сохранять версии (черновики) регулярно, но не публиковать.

---

# 13. Пример полного потока (псевдо-код)

1. UI (PostEditor) → вызывает `useCreatePost.mutate({title, markdown})`
2. `useCreatePost` (application) → validate via `domain.validatePostInput`
3. `useCreatePost` → postsRepo.createPost(...)
4. Repo creates `posts` + `post_versions`
5. User clicks Publish → `usePublishPost.mutate({postId, versionId})`
6. `usePublishPost` → `domain.applyPublishRules`, then `postsRepo.publishVersion`
7. cache invalidation → UI shows published post at `/posts/:slug`

---

Если хочешь, могу:

- написать точный пример `posts.api.ts` для твоего `createCoreApi`/Appwrite-обёртки (вместе с транзакциями),
- или разобрать и переписать один конкретный файл редактора и `useCreatePost`/`usePublishPost` с реальным кодом (TypeScript) под твой стек.

Куда двинем дальше?
