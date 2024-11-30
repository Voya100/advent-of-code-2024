export class ExtendedSet<T> extends Set<T> {
  constructor(iterable?: Iterable<T>) {
    super(iterable);
  }

  addAll(iterable: Iterable<T>) {
    for (const value of iterable) {
      this.add(value);
    }
  }

  intersect(iterable: Iterable<T>) {
    const newSet = new ExtendedSet<T>();
    for (const value of iterable) {
      if (this.has(value)) {
        newSet.add(value);
      }
    }
    return newSet;
  }

  intersectAll(iterables: Iterable<T>[]) {
    let newSet = this.intersect(iterables[0]);
    for (const iterable of iterables.slice(1)) {
      newSet = newSet.intersect(iterable);
    }
    return newSet;
  }

  getFistValue() {
    return this.values().next().value as T;
  }
}
