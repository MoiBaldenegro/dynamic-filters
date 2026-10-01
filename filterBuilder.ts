export interface IFilterBuilder<T, Self = any> {
  wherePredicate(predicate: (item: T) => boolean): Self;
  build(): T[];
}

export interface FilterFunctionalBuilder<T> extends IFilterBuilder<T, FilterFunctionalBuilder<T>> {
  where: <K extends keyof T>(
    key: K,
    predicate: (itemValue: T[K], targetValue: any) => boolean,
    targetValue: any
  ) => FilterFunctionalBuilder<T>;
  wherePredicate: (predicate: (item: T) => boolean) => FilterFunctionalBuilder<T>;
  build: () => T[];
}

export const createFilterBuilder = <T>(items: T[]): FilterFunctionalBuilder<T> => {
  // Mantenemos una referencia inmutable del estado actual
  const currentItems: T[] = [...items];

  return {
    where: (key, predicate, targetValue) => {
      // Si el valor del filtro no está definido, devolvemos un nuevo builder con el estado intacto
      if (targetValue === undefined || targetValue === null) {
        return createFilterBuilder(currentItems);
      }

      // Filtramos sobre el estado actual
      const filtered = currentItems.filter((item) =>
        predicate(item[key], targetValue)
      );

      // Devolvemos una NUEVA instancia del builder con el subconjunto filtrado
      return createFilterBuilder(filtered);
    },

    wherePredicate: (predicate) => {
      const filtered = currentItems.filter(predicate);
      return createFilterBuilder(filtered);
    },

    build: () => [...currentItems],
  };
};