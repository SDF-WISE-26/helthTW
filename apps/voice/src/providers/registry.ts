/** Picks an implementation by name, so switching a model is an env var, not a code change. */
export function pick<T>(kind: string, name: string, registry: Record<string, () => T>): T {
  const create = registry[name];
  if (!create) {
    throw new Error(
      `Unknown ${kind} provider "${name}". Available: ${Object.keys(registry).join(", ")}`,
    );
  }
  return create();
}
