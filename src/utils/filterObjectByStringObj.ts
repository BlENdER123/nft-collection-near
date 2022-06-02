export default function filterHelper(this: any, propPath: string, values: string[]) {
  const list = Object.fromEntries(values.map(v => [v, true])),
    path = propPath.split('.');
  const propValOf = (obj: any) => path.reduce((r, p) => r[p], obj);
  return this.filter((o: any) => !(propValOf(o) in list));
}