// ─────────────────────────────────────────────────────────────────────────────
// Strapi API Fetcher
// Fluent builder pattern — chain populate, filters, sort, pagination, and more.
// ─────────────────────────────────────────────────────────────────────────────

const STRAPI_URL = process.env.STRAPI_URL ?? "http://127.0.0.1:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// ── Types ─────────────────────────────────────────────────────────────────────

export type StrapiResponse<T> = {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiItem<T> = {
  id: number;
  documentId: string;
} & T;

type FilterOperator =
  | "$eq"
  | "$ne"
  | "$lt"
  | "$lte"
  | "$gt"
  | "$gte"
  | "$in"
  | "$nin"
  | "$contains"
  | "$startsWith"
  | "$endsWith"
  | "$null"
  | "$notNull";

type SortOrder = "asc" | "desc";

type FetchOptions = Omit<RequestInit, "method" | "headers"> & {
  /** Next.js cache option */
  cache?: RequestCache;
  /** Next.js revalidation in seconds */
  revalidate?: number | false;
  tags?: string[];
};

// ── Query Builder ─────────────────────────────────────────────────────────────

class StrapiQuery<T = unknown> {
  private params = new URLSearchParams();
  private populateFields: string[] = [];

  constructor(private readonly path: string) {}

  // ── Populate ──────────────────────────────────────────────────────────────

  /** Populate all relations one level deep. */
  populateAll(): this {
    this.params.set("populate", "*");
    return this;
  }

  /** Populate specific relation fields. */
  populate(...fields: string[]): this {
    fields.forEach((field, i) => {
      this.params.set(`populate[${this.populateFields.length + i}]`, field);
    });
    this.populateFields.push(...fields);
    return this;
  }

  // ── Filters ───────────────────────────────────────────────────────────────

  /** Add a filter. e.g. `.filter("slug", "$eq", "my-post")` */
  filter(field: string, operator: FilterOperator, value: unknown): this {
    this.params.set(`filters[${field}][${operator}]`, String(value));
    return this;
  }

  /** Shorthand for `$eq` filter. */
  where(field: string, value: unknown): this {
    return this.filter(field, "$eq", value);
  }

  // ── Sort ──────────────────────────────────────────────────────────────────

  /** Sort results. e.g. `.sortBy("createdAt", "desc")` */
  sortBy(field: string, order: SortOrder = "asc"): this {
    const existing = this.params.getAll("sort");
    this.params.set(`sort[${existing.length}]`, `${field}:${order}`);
    return this;
  }

  // ── Pagination ────────────────────────────────────────────────────────────

  /** Paginate using page number. */
  page(page: number, pageSize = 25): this {
    this.params.set("pagination[page]", String(page));
    this.params.set("pagination[pageSize]", String(pageSize));
    return this;
  }

  /** Paginate using offset/limit. */
  limit(limit: number, start = 0): this {
    this.params.set("pagination[limit]", String(limit));
    this.params.set("pagination[start]", String(start));
    return this;
  }

  // ── Fields ────────────────────────────────────────────────────────────────

  /** Restrict returned fields (select). */
  fields(...fieldNames: string[]): this {
    fieldNames.forEach((f, i) => this.params.set(`fields[${i}]`, f));
    return this;
  }

  // ── Locale ────────────────────────────────────────────────────────────────

  /** Set locale for internationalized content. */
  locale(code: string): this {
    this.params.set("locale", code);
    return this;
  }

  // ── Execution ─────────────────────────────────────────────────────────────

  private buildUrl(): string {
    const qs = this.params.toString();
    return `${STRAPI_URL}/api/${this.path}${qs ? `?${qs}` : ""}`;
  }

  private buildHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (STRAPI_TOKEN) headers["Authorization"] = `Bearer ${STRAPI_TOKEN}`;
    return headers;
  }

  /** Fetch a collection — returns `StrapiResponse<StrapiItem<T>[]>`. */
  async get(options: FetchOptions = {}): Promise<StrapiResponse<StrapiItem<T>[]>> {
    const { revalidate, tags, cache, ...rest } = options;
    const res = await fetch(this.buildUrl(), {
      ...rest,
      method: "GET",
      headers: this.buildHeaders(),
      next: {
        ...(revalidate !== undefined ? { revalidate } : {}),
        ...(tags ? { tags } : {}),
      },
      ...(cache ? { cache } : {}),
    });

    if (!res.ok) {
      throw new StrapiError(res.status, res.statusText, await res.text());
    }

    return res.json() as Promise<StrapiResponse<StrapiItem<T>[]>>;
  }

  /** Fetch a single entry by id or slug — returns `StrapiResponse<StrapiItem<T>>`. */
  async getOne(
    idOrSlug: string | number,
    options: FetchOptions = {},
  ): Promise<StrapiResponse<StrapiItem<T>>> {
    const { revalidate, tags, cache, ...rest } = options;
    const url = `${STRAPI_URL}/api/${this.path}/${idOrSlug}${
      this.params.toString() ? `?${this.params}` : ""
    }`;

    const res = await fetch(url, {
      ...rest,
      method: "GET",
      headers: this.buildHeaders(),
      next: {
        ...(revalidate !== undefined ? { revalidate } : {}),
        ...(tags ? { tags } : {}),
      },
      ...(cache ? { cache } : {}),
    });

    if (!res.ok) {
      throw new StrapiError(res.status, res.statusText, await res.text());
    }

    return res.json() as Promise<StrapiResponse<StrapiItem<T>>>;
  }

  /** POST — create a new entry. */
  async create(body: Partial<T>, options: FetchOptions = {}): Promise<StrapiResponse<StrapiItem<T>>> {
    const res = await fetch(this.buildUrl(), {
      ...options,
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({ data: body }),
    });

    if (!res.ok) {
      throw new StrapiError(res.status, res.statusText, await res.text());
    }

    return res.json() as Promise<StrapiResponse<StrapiItem<T>>>;
  }

  /** PUT — update an existing entry. */
  async update(
    id: string | number,
    body: Partial<T>,
    options: FetchOptions = {},
  ): Promise<StrapiResponse<StrapiItem<T>>> {
    const url = `${STRAPI_URL}/api/${this.path}/${id}`;
    const res = await fetch(url, {
      ...options,
      method: "PUT",
      headers: this.buildHeaders(),
      body: JSON.stringify({ data: body }),
    });

    if (!res.ok) {
      throw new StrapiError(res.status, res.statusText, await res.text());
    }

    return res.json() as Promise<StrapiResponse<StrapiItem<T>>>;
  }

  /** DELETE — remove an entry. */
  async delete(
    id: string | number,
    options: FetchOptions = {},
  ): Promise<StrapiResponse<StrapiItem<T>>> {
    const url = `${STRAPI_URL}/api/${this.path}/${id}`;
    const res = await fetch(url, {
      ...options,
      method: "DELETE",
      headers: this.buildHeaders(),
    });

    if (!res.ok) {
      throw new StrapiError(res.status, res.statusText, await res.text());
    }

    return res.json() as Promise<StrapiResponse<StrapiItem<T>>>;
  }
}

// ── Error Class ───────────────────────────────────────────────────────────────

export class StrapiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    public readonly body: string,
  ) {
    super(`Strapi ${status} ${statusText}: ${body}`);
    this.name = "StrapiError";
  }
}

// ── Entry Point ───────────────────────────────────────────────────────────────

/**
 * Create a Strapi query builder for the given collection/single type path.
 *
 * @example
 * // Fetch all articles, populate cover image
 * const { data } = await strapi<Article>("articles")
 *   .populate("cover")
 *   .sortBy("publishedAt", "desc")
 *   .page(1, 10)
 *   .get({ revalidate: 60 });
 *
 * @example
 * // Fetch a single article by slug
 * const { data } = await strapi<Article>("articles")
 *   .where("slug", "hello-world")
 *   .populateAll()
 *   .getOne(1, { tags: ["articles"] });
 */
export function strapi<T = unknown>(path: string): StrapiQuery<T> {
  return new StrapiQuery<T>(path);
}

export default strapi;
